<?php

namespace Admin\Assets;

/**
 * Admin enquque scripts
 */
function admin_assets( $hook ) {

    global $post;

    $utility_vars = [
      'ajaxURL' => admin_url('admin-ajax.php'),
      'requestNonce' => wp_create_nonce('request-nonce'),
      'postID' => $post ? $post->ID : 0,
      'postName' => $post ? $post->post_name : '',
      'screen' => get_current_screen(),
      'params' => filter_input_array(INPUT_GET),
    ];

    // admin javascript
    wp_enqueue_script( 'my-theme/admin', get_template_directory_uri() . '/js/main.js', ['jquery'], '', true );

    // some handy variables to use in our javascript
    wp_localize_script('my-theme/admin', 'utilityVars', $utility_vars);

}
add_action( 'admin_enqueue_scripts', __NAMESPACE__ . '\\admin_assets' );


/**
 * Function to be run on ajax request.
 * Only hook for logged in users.
 */
function async_pdf_gen() {

  // verify nonce
  check_ajax_referer('request-nonce', '_ajax_nonce');

  if ( isset($_POST['action']) && $_POST['action'] == 'my_php_action' ) {

    // do some stuff here.
    // maybe query the database for a list of posts...

    // REMOVE! only for demo purposes
    sleep(3);

    // echo the success message
    echo 'Success message from server!';

  } else {

    echo 'Oh snap! Looks like there was an error.';

  }

  wp_die();
}
add_action( 'wp_ajax_my_php_action', __NAMESPACE__ . '\\async_pdf_gen' );
