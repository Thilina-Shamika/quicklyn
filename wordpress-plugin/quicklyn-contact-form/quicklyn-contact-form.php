<?php
/**
 * Plugin Name: Quicklyn Contact Form
 * Plugin URI: https://quicklyn.com
 * Description: Stores Contact Us form submissions, sends confirmation and admin notification emails, and allows CSV export.
 * Author: Quicklyn
 * Version: 1
 * Text Domain: quicklyn-contact-form
 * Requires at least: 5.9
 * Requires PHP: 7.4
 */

if (!defined('ABSPATH')) {
    exit;
}

define('QUICKLYN_CF_VERSION', '1');
define('QUICKLYN_CF_TABLE', 'quicklyn_contact_submissions');
define('QUICKLYN_CF_OPTIONS', 'quicklyn_contact_form_options');

/**
 * CORS: allow frontend origin to POST to REST API (for headless)
 */
add_filter('rest_pre_serve_request', function ($value) {
    $opts = get_option(QUICKLYN_CF_OPTIONS, array());
    $allow_origin = isset($opts['allow_origin']) ? trim($opts['allow_origin']) : '';
    $request_origin = isset($_SERVER['HTTP_ORIGIN']) ? trim($_SERVER['HTTP_ORIGIN']) : '';
    if ($allow_origin !== '' && $request_origin !== '' && $request_origin === $allow_origin) {
        header('Access-Control-Allow-Origin: ' . esc_url_raw($allow_origin));
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type');
    }
    return $value;
}, 10, 1);

/**
 * Default options: notification_emails (array), from_name, from_email
 */
function quicklyn_cf_get_options() {
    $defaults = array(
        'notification_emails' => array(get_option('admin_email')),
        'from_name'           => get_bloginfo('name'),
        'from_email'          => get_option('admin_email'),
    );
    $saved = get_option(QUICKLYN_CF_OPTIONS, array());
    if (!empty($saved['notification_emails']) && is_string($saved['notification_emails'])) {
        $saved['notification_emails'] = array_filter(array_map('trim', explode("\n", $saved['notification_emails'])));
    }
    return wp_parse_args($saved, $defaults);
}

/**
 * Create submissions table on activation
 */
function quicklyn_cf_activate() {
    global $wpdb;
    $table = $wpdb->prefix . QUICKLYN_CF_TABLE;
    $charset = $wpdb->get_charset_collate();
    $sql = "CREATE TABLE IF NOT EXISTS $table (
        id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
        name varchar(255) NOT NULL DEFAULT '',
        email varchar(255) NOT NULL DEFAULT '',
        message longtext NOT NULL,
        created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        KEY created_at (created_at)
    ) $charset;";
    require_once ABSPATH . 'wp-admin/includes/upgrade.php';
    dbDelta($sql);
    update_option('quicklyn_cf_db_version', QUICKLYN_CF_VERSION);
}
register_activation_hook(__FILE__, 'quicklyn_cf_activate');

/**
 * REST API: submit contact form
 */
add_action('rest_api_init', function () {
    register_rest_route('quicklyn-contact/v1', '/submit', array(
        'methods'             => 'POST',
        'permission_callback' => '__return_true',
        'args'                => array(
            'name'    => array(
                'required'          => true,
                'type'               => 'string',
                'sanitize_callback'  => 'sanitize_text_field',
                'validate_callback'  => function ($v) {
                    return is_string($v) && strlen(trim($v)) <= 255;
                },
            ),
            'email'   => array(
                'required'          => true,
                'type'               => 'string',
                'sanitize_callback'  => 'sanitize_email',
                'validate_callback'  => function ($v) {
                    return is_email($v);
                },
            ),
            'message' => array(
                'required'          => true,
                'type'               => 'string',
                'sanitize_callback'  => 'sanitize_textarea_field',
                'validate_callback'  => function ($v) {
                    return is_string($v) && strlen($v) <= 50000;
                },
            ),
        ),
        'callback' => 'quicklyn_cf_rest_submit',
    ));
});

function quicklyn_cf_rest_submit(WP_REST_Request $request) {
    $name    = trim($request->get_param('name'));
    $email   = trim($request->get_param('email'));
    $message = trim($request->get_param('message'));

    if (empty($name) || !is_email($email) || empty($message)) {
        return new WP_REST_Response(array('success' => false, 'message' => 'Invalid data.'), 400);
    }

    global $wpdb;
    $table = $wpdb->prefix . QUICKLYN_CF_TABLE;
    $inserted = $wpdb->insert(
        $table,
        array(
            'name'  => $name,
            'email' => $email,
            'message' => $message,
        ),
        array('%s', '%s', '%s')
    );

    if ($inserted === false) {
        return new WP_REST_Response(array('success' => false, 'message' => 'Could not save submission.'), 500);
    }

    $opts = quicklyn_cf_get_options();
    $from_name  = !empty($opts['from_name']) ? $opts['from_name'] : get_bloginfo('name');
    $from_email = !empty($opts['from_email']) && is_email($opts['from_email']) ? $opts['from_email'] : get_option('admin_email');
    $headers = array(
        'Content-Type: text/plain; charset=UTF-8',
        'From: ' . $from_name . ' <' . $from_email . '>',
    );

    $subject_user = sprintf('[%s] We received your message', get_bloginfo('name'));
    $body_user = "Hello " . $name . ",\n\nThank you for contacting us. We have received your message and will get back to you soon.\n\nYour message:\n" . $message . "\n\nBest regards,\n" . $from_name;
    wp_mail($email, $subject_user, $body_user, $headers);

    $admin_emails = $opts['notification_emails'];
    if (!is_array($admin_emails)) {
        $admin_emails = array_filter(array_map('trim', explode("\n", (string) $admin_emails)));
    }
    $admin_emails = array_filter($admin_emails, 'is_email');
    if (!empty($admin_emails)) {
        $subject_admin = sprintf('[%s] New contact form submission from %s', get_bloginfo('name'), $name);
        $body_admin = "New contact form submission:\n\nName: " . $name . "\nEmail: " . $email . "\nMessage:\n" . $message . "\n\nSubmitted at: " . current_time('mysql');
        wp_mail($admin_emails, $subject_admin, $body_admin, $headers);
    }

    return new WP_REST_Response(array('success' => true, 'message' => 'Thank you. Your message has been sent.'), 200);
}

/**
 * Admin menu: Contact Submissions + Settings
 */
add_action('admin_menu', function () {
    add_menu_page(
        'Contact Submissions',
        'Contact Submissions',
        'manage_options',
        'quicklyn-contact-submissions',
        'quicklyn_cf_admin_page_list',
        'dashicons-email-alt',
        30
    );
    add_submenu_page(
        'quicklyn-contact-submissions',
        'Submissions',
        'Submissions',
        'manage_options',
        'quicklyn-contact-submissions',
        'quicklyn_cf_admin_page_list'
    );
    add_submenu_page(
        'quicklyn-contact-submissions',
        'Email Settings',
        'Email Settings',
        'manage_options',
        'quicklyn-contact-settings',
        'quicklyn_cf_admin_page_settings'
    );
});

function quicklyn_cf_admin_page_list() {
    global $wpdb;
    $table = $wpdb->prefix . QUICKLYN_CF_TABLE;

    if (isset($_GET['export']) && $_GET['export'] === 'csv' && current_user_can('manage_options')) {
        quicklyn_cf_export_csv($table);
        return;
    }

    $per_page = 20;
    $page = isset($_GET['paged']) ? max(1, (int) $_GET['paged']) : 1;
    $offset = ($page - 1) * $per_page;
    $total = (int) $wpdb->get_var("SELECT COUNT(*) FROM $table");
    $items = $wpdb->get_results($wpdb->prepare(
        "SELECT id, name, email, message, created_at FROM $table ORDER BY created_at DESC LIMIT %d OFFSET %d",
        $per_page,
        $offset
    ), ARRAY_A);

    ?>
    <div class="wrap">
        <h1>Contact form submissions</h1>
        <p>
            <a href="<?php echo esc_url(admin_url('admin.php?page=quicklyn-contact-submissions&export=csv')); ?>" class="button button-primary">Export as CSV</a>
            <a href="<?php echo esc_url(admin_url('admin.php?page=quicklyn-contact-settings')); ?>" class="button">Email Settings</a>
        </p>
        <?php if (empty($items)) : ?>
            <p>No submissions yet.</p>
        <?php else : ?>
            <table class="wp-list-table widefat fixed striped">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Message</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($items as $row) : ?>
                        <tr>
                            <td><?php echo esc_html($row['created_at']); ?></td>
                            <td><?php echo esc_html($row['name']); ?></td>
                            <td><a href="mailto:<?php echo esc_attr($row['email']); ?>"><?php echo esc_html($row['email']); ?></a></td>
                            <td><?php echo esc_html(wp_trim_words($row['message'], 20)); ?></td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
            <?php
            $total_pages = (int) ceil($total / $per_page);
            if ($total_pages > 1) {
                echo '<p class="pagination-links">';
                for ($i = 1; $i <= $total_pages; $i++) {
                    if ($i == $page) {
                        echo '<span class="pagination-links current">' . $i . '</span> ';
                    } else {
                        echo '<a href="' . esc_url(admin_url('admin.php?page=quicklyn-contact-submissions&paged=' . $i)) . '">' . $i . '</a> ';
                    }
                }
                echo '</p>';
            }
            ?>
        <?php endif; ?>
    </div>
    <?php
}

function quicklyn_cf_export_csv($table) {
    global $wpdb;
    $rows = $wpdb->get_results("SELECT name, email, message, created_at FROM $table ORDER BY created_at DESC", ARRAY_A);
    header('Content-Type: text/csv; charset=UTF-8');
    header('Content-Disposition: attachment; filename="quicklyn-contact-submissions-' . date('Y-m-d-His') . '.csv"');
    $out = fopen('php://output', 'w');
    fprintf($out, "\xEF\xBB\xBF");
    fputcsv($out, array('Date', 'Name', 'Email', 'Message'));
    foreach ($rows as $row) {
        fputcsv($out, array($row['created_at'], $row['name'], $row['email'], $row['message']));
    }
    fclose($out);
    exit;
}

function quicklyn_cf_admin_page_settings() {
    $saved = get_option(QUICKLYN_CF_OPTIONS, array());
    $notification_emails = isset($saved['notification_emails']) ? $saved['notification_emails'] : array(get_option('admin_email'));
    if (is_array($notification_emails)) {
        $notification_emails_str = implode("\n", $notification_emails);
    } else {
        $notification_emails_str = is_string($notification_emails) ? $notification_emails : '';
    }
    $from_name  = isset($saved['from_name']) ? $saved['from_name'] : get_bloginfo('name');
    $from_email = isset($saved['from_email']) ? $saved['from_email'] : get_option('admin_email');
    $allow_origin = isset($saved['allow_origin']) ? $saved['allow_origin'] : '';

    if (isset($_POST['quicklyn_cf_save']) && current_user_can('manage_options')) {
        check_admin_referer('quicklyn_cf_settings');
        $from_name  = sanitize_text_field($_POST['from_name']);
        $from_email = sanitize_email($_POST['from_email']);
        $notification_emails_str = sanitize_textarea_field($_POST['notification_emails']);
        $allow_origin = esc_url_raw(trim($_POST['allow_origin']));
        $emails = array_filter(array_map('trim', explode("\n", $notification_emails_str)));
        $emails = array_filter($emails, 'is_email');
        update_option(QUICKLYN_CF_OPTIONS, array(
            'from_name'           => $from_name,
            'from_email'          => $from_email,
            'notification_emails' => $emails,
            'allow_origin'        => $allow_origin,
        ));
        echo '<div class="notice notice-success"><p>Settings saved.</p></div>';
        $notification_emails_str = implode("\n", $emails);
    }
    ?>
    <div class="wrap">
        <h1>Email Settings</h1>
        <p>Configure how contact form emails are sent. For reliable delivery (especially from headless frontends), use an SMTP plugin (e.g. WP Mail SMTP, FluentSMTP) and set the same From address below.</p>
        <form method="post" action="">
            <?php wp_nonce_field('quicklyn_cf_settings'); ?>
            <table class="form-table">
                <tr>
                    <th scope="row"><label for="from_name">From name</label></th>
                    <td><input name="from_name" id="from_name" type="text" value="<?php echo esc_attr($from_name); ?>" class="regular-text" /></td>
                </tr>
                <tr>
                    <th scope="row"><label for="from_email">From email</label></th>
                    <td>
                        <input name="from_email" id="from_email" type="email" value="<?php echo esc_attr($from_email); ?>" class="regular-text" />
                        <p class="description">Use an address on your domain (e.g. noreply@yoursite.com) for better deliverability.</p>
                    </td>
                </tr>
                <tr>
                    <th scope="row"><label for="notification_emails">Notification emails</label></th>
                    <td>
                        <textarea name="notification_emails" id="notification_emails" rows="5" class="large-text"><?php echo esc_textarea($notification_emails_str); ?></textarea>
                        <p class="description">One email per line. These addresses will receive each new contact form submission.</p>
                    </td>
                </tr>
                <tr>
                    <th scope="row"><label for="allow_origin">Allowed origin (CORS)</label></th>
                    <td>
                        <input name="allow_origin" id="allow_origin" type="url" value="<?php echo esc_attr($allow_origin); ?>" class="regular-text" placeholder="https://your-frontend.com" />
                        <p class="description">If your contact form is on a different domain (e.g. headless frontend), enter its full URL here so the browser can submit (e.g. https://quick.rootholdings.com.mv). Leave empty if form is on same domain.</p>
                    </td>
                </tr>
            </table>
            <p class="submit"><button type="submit" name="quicklyn_cf_save" class="button button-primary">Save settings</button></p>
        </form>
    </div>
    <?php
}
