/**
 * Ajax call to wp-admin-ajax.
 * On success or fail, we will write a message to our notice div.
 *
 * @var object | utilityVars - a window scoped theme variable
 */
function makeAjaxCall() {

  var data = {
    'action': 'my_php_action',
    '_ajax_nonce': utilityVars.requestNonce,
    'postID': utilityVars.postID
  };

  $.ajax({
    method: 'POST',
    url: utilityVars.ajaxURL,
    data: data,
    beforeSend: function () {
      // do stuff before sending...
    }
  })
  .success(function (message) {
    var html = '<p>'+message+'</p>';
    $('#ajax-pdf-notice').html(html).removeClass('notice-warning').addClass('notice-success');
  })
  .error(function (err) {
    var html = '<p>Apologies, there was an error. ('+ err.statusText +')</p>';
    $('#ajax-pdf-notice').html(html).removeClass('notice-warning').addClass('notice-error');
    console.log(err);
  });

}

/**
 * Detect when a post has been udpated. This occurs after the page is refreshed.
 * Only fires on specified post types.
 */
function save_post_listener() {

  // make sure we are on the edit post screen
  if (utilityVars.screen !== 'undefined' && utilityVars.screen.base !== 'post') {
    return false;
  }

  // these are the post types which will receive this action
  var postTypes = ['post', 'page'];

  // check if current screen is an allowed post type
  if ($.inArray(utilityVars.screen.post_type, postTypes) === -1) {
    return false;
  }

  // use the WP "updated" message to determine if we just saved this post
  if (parseInt(utilityVars.params.message) === 1 && $('#message').hasClass('updated')) {

    // inital PDF generating notice
    $('#message').after('<div id="ajax-pdf-notice" class="notice notice-warning is-dismissible"><span class="spinner" style="visibility:visible;float:left;margin:8px 5px 0 0;"></span><p>Printable PDF is generating. Do not refresh the page until this is complete.</p></div>');

    // ajax call
    makeAjaxCall();

  }

}


/**
 * Fire events on document ready.
 */
(function($) {

  $(document).ready(function () {

    save_post_listener();

  });

})(jQuery);