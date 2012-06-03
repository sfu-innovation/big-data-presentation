(function($, deck, undefined) {
   $(document).bind('deck.change', function(e, from, to) {
      var $prev = $[deck]('getSlide', to-1),
      $next = $[deck]('getSlide', to+1),
      $oldprev = $[deck]('getSlide', from-1),
      $oldnext = $[deck]('getSlide', from+1);

      $[deck]('getSlide', to).trigger('deck.active');
      $[deck]('getSlide', from).trigger('deck.blur');
   });
})(jQuery, 'deck');