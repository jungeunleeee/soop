$(document).ready(function () {
  preventDefaultAnchor();
  navigation();
  mainSlideShow('#main-visual .actor-image');
  community();
  swipeSlideShow('#main-work');
  showShow('#main-vod');
  mobileGnb();
});

function preventDefaultAnchor() {
  $(document).on('click', 'a[href="#"]', function (e) {
    e.preventDefault();
  });
}

function navigation() {
  $('ul.gnb-list > li > a ').on('mouseenter', function () {
    $('#header').addClass('open');
    $('ul.gnb-list').addClass('on');
  });

  $('ul.gnb-list').on('focusin', function () {
    $('#header').addClass('open');
    $('ul.gnb-list').addClass('on');
  }).on('focusout', function () {
    $('#header').removeClass('open');
    $('ul.gnb-list').removeClass('on');
  });

  $('#header').mouseleave(function () {
    $('#header').removeClass('open');
    $('ul.gnb-list').removeClass('on');
  });
}

function mainSlideShow(selector) {
  var $selector = $(selector);
  var numSlide = $selector.find('li').length;
  var timerId = '';
  var timerSpeed = 3000;
  var slideNow = 0;
  var slidePrev = 0;
  var slideNext = 0;
  var isTimerOn = true;
  var slideFirst = 1;
  // var loadCounter = 0;
  var onAnimation = true;

  showSlide(slideFirst);

  $('#main-visual .actor-list > li > a ').mouseenter(function () {
    stopTimer();
    var index = $('#main-visual .actor-list > li').index($(this).parent());
    showSlide(index + 1);
  });

  $('#main-visual .actor-list > li > a ').mouseleave(function () {
    resetTimer();
    startTimer();
  });

  // 시간 관련 함수
  function startTimer() {
    timerId = setTimeout(function () {
      showSlide(slideNext);
    }, timerSpeed);
    isTimerOn = true;
  }

  function stopTimer() {
    clearTimeout(timerId);
    isTimerOn = false;
  }

  function resetTimer() {
    clearTimeout(timerId);
    if (isTimerOn === true) {
      timerId = setTimeout(function () {
        showSlide(slideNext);
      }, timerSpeed);
    }
  }

  function showSlide(n) {
    resetTimer();
    if (slideNow === 0) {
      $selector.find('li:eq(' + (n - 1) + ')').addClass('on');
    } else {
      onAnimation = true;
      $selector.find('li:eq(' + (slideNow - 1) + ')').removeClass().addClass('hide').one('animationend', function () {
        $(this).removeClass();
        onAnimation = false;
      });
      $selector.find('li:eq(' + (n - 1) + ')').addClass('show');
    }

    // 해당번호 저장
    slideNow = n;
    slidePrev = (n === 1) ? numSlide : (n - 1);
    slideNext = (n === numSlide) ? 1 : (n + 1);
    console.log(slidePrev + ' / ' + slideNow + ' / ' + slideNext);
  }


}

function community(){
  $('#main-community div.community-list > div.list > a ').mouseenter(function () {
    var num = $('#main-community div.community-list > div.list').index($(this).parent());
    $('#main-community div.community-list > div.list > a > div.image').removeClass('on');
    $('#main-community div.community-list > div.list > a > div.image:eq(' + num + ')').addClass('on');
  });

  $('#main-community div.community-list > div.list > a ').mouseleave(function () {
    $('#main-community div.community-list > div.list > a > div.image').removeClass('on');
  });
}

function swipeSlideShow(selector) {
  var $selector = $(selector);
  var numSlide = $selector.find('div.content-box div.box > ul.slide > li').length;
  var slideNow = 0;
  var slideNext = 0;
  var slidePrev = 0;
  var startX = 0;
  var startY = 0;
  var delX = 0; // 마우스가 움직일 때 마다 계속 변함
  var delY = 0;
  var offsetX = 0;
  var offsetY = 0;
  var isBlocked = false;

  showSlide(1);
  $selector.find('div.content-box  div.box > .slide > li').each(function (i) {
    $(this).css({
      'left': (i * 100) + '%'
    });
  });

  $selector.find('p.control a.prev').on('click', function () {
    showSlide(slidePrev);
  });

  $selector.find('p.control a.next').on('click', function () {
    showSlide(slideNext);
  });

  $selector.find('.slide').on('mousedown', function (e) {
    e.preventDefault();
    $(this).css({
      'transition': 'none'
    });
    isBlocked = true;
    startX = e.clientX;
    startY = e.clientY;
    offsetX = $(this).position().left;
    offsetY = $(this).position().top;

    $(document).on('mousemove', function (e) {
      delX = e.clientX - startX;
      delY = e.clientY - startY;
      delY = 0;
      if ((slideNow === 1 && delX > 0) || (slideNow === numSlide && delX < 0)) {
        delX = delY / 10;
      }
      $selector.find('.slide').css({
        'left': (offsetX + delX) + 'px',
        'top': (offsetY + delY) + 'px'
      });
      if (Math.abs(delX > 5) || Math.abs(delY > 5)) {
        isBlocked = true;
      }
    });

    $(document).on('mouseup', function (e) {
      $(document).off('mousemove mouseup');
      if (delX < -50 && slideNow !== numSlide) {
        showSlide(slideNext);
      } else if (delX > 50 && slideNow !== 1) {
        showSlide(slidePrev);
      } else {
        showSlide(slideNow);
      }
      delX = delY = 0;
    });

    $selector.find('.slide').on('click', function (e) {
      if (isBlocked === true) {
        e.preventDefault();
        isBlocked = false;
      }
    })

  });

  function showSlide(n) {
    $selector.find('ul.slide > li').css({
      'transform': 'scale(0.8)',
      'opacity': '0.2',
      'padding': '0 20px'
    });
    $selector.find('ul.slide').css({
      'left': (-(n - 1) * 100) + '%',
      'transition': 'left 0.3s'
    });
    $selector.find('ul.slide > li:eq(' + (n - 1) + ') ').css({
      'transform': 'scale(1.2)',
      'transition': 'all 0.5s',
      'padding': '0 20px',
      'opacity': '1'
    });
    slideNow = n;
    slidePrev = (n === 1) ? 1 : (n - 1);
    slideNext = (n === numSlide) ? numSlide : (n + 1);
    console.log(`${slidePrev} / ${slideNow} / ${slideNext}`)

  }

}

function showShow(selector) {
  var $selector = $(selector);
  var numBanner = 0;
  var bannerNow = 1; //1번 보여줘서 시작하겠다
  var bannerPrev = 0;
  var bannerNext = 0;
  var offsetLeft = 0;
  var widthBox = 0;
  var widthBar = 0;
  var offsetLeftMin = 0;
  var loadCounter = 0;

  setTimeout(function () {
    setStatus();
  }, 800);

  $selector.find('.slide li > img').on('load', function () {
    loadCounter++;
    if (loadCounter === $selector.find('.slide li').length) {
      setStatus();
    }
  });

  $selector.find('.control a.prev').on('click', function () {
    if (bannerNow === 1) {
      $selector.find('.slide').css({
        'transition': 'left 0.05s',
        'left': '10px'
      }).one('transitionend', function () {
        $(this).css({
          'transition': 'left 0.1s',
          'left': '0px'
        });
      });
    } else {
      showBanner(bannerPrev);
    }
  });

  $selector.find('.control a.next').on('click', function () {
    if (bannerNow === numBanner) {
      $selector.find('.slide').css({
        'transition': 'left 0.05s',
        'left': (offsetLeftMin - 10) + 'px'
      }).one('transitionend',
        function () {
          $(this).css({
            'transition': 'left 0.1s',
            'left': offsetLeftMin + 'px'
          });
        });
    } else {
      showBanner(bannerNext);
    }
  });

  $(window).on('resize', function () {
    setStatus();
  });


  function showBanner(n) {
    offsetLeft = -$selector.find('.slide > li:eq(' + (n - 1) + ')').position().left;
    // console.log(offsetLeft);
    if (offsetLeft <= offsetLeftMin) offsetLeft = offsetLeftMin;
    $selector.find('ul.slide').css({
      'transition': 'left 0.3s',
      'left': offsetLeft + 'px'
    });
    bannerNow = n;
    bannerPrev = (n === 1) ? 1 : (n - 1);
    bannerNext = (n === numBanner) ? numBanner : (n + 1);
  }


  function setStatus() {
    widthBox = $selector.find('.box').innerWidth();
    widthBar = 0;
    $selector.find('.slide > li').each(function () {
      widthBar += $(this).outerWidth(true);
    });
    offsetLeftMin = widthBox - widthBar;
    $selector.find('.slide').css({
      'width': widthBar + 'px'
    });
    $selector.find('.slide > li').each(function (i) {
      if (-$(this).position().left <= offsetLeftMin) {
        numBanner = i + 1;
        return false;
      }
      showBanner(bannerNow);
    });
  }
}

function mobileGnb () {
  // navigation
  $('#mobile-menu').on('click', function () {
    $('#header > div.content-box > div.table-right').addClass('open');

    $('a.close').on('click', function () {
    $('#header > div.content-box > div.table-right').removeClass('open')
    });
  });

  $('#header ul.gnb-list > li > a').on('click', function (e) {
    var windowWidth = $(window).width();
    if (windowWidth < 1024 && $(this).parent().find('ul').length > 0) {
      e.preventDefault();
      var height = 0;
      $(this).next().find('> li').each(function () {
        height += $(this).outerHeight(true);
      });
      $(this).next().css({
        'height': height + 'px'
      });
      var index = $('#header ul.gnb-list > li').index($(this).parent());

      $('#header ul.gnb-list > li').removeClass('on');
      $('#header ul.gnb-list > li:eq(' + index + ')').addClass('on');

      $(this).parent().siblings().each(function () {
        $(this).find('ul').css({
          'height': '0px'
        });
      });
    }
  });
}


$(window).on('resize', function () {
  var windowWidth = $(window).width();
  if (windowWidth >= 1024) {
    $('#header ul.gnb-list > li').removeClass('on');
    $('#header div.table-right').removeClass('open');
  }
});

//on 