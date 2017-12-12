// Global parameters
window.params = {
    isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
    isIOS: /iPhone|iPad|iPod/i.test(navigator.userAgent)
};


/**
     *
     * Check if element exist on page
     *
     * @param el {string} jQuery object (#popup)
     *
     * @return {bool}
     *
*/
function exist(el){
    if ( $(el).length > 0 ) {
        return true;
    } else {
        return false;
    }
}


jQuery(document).ready(function($) {

    /*---------------------------
                                  ADD CLASS ON SCROLL
    ---------------------------*/
    $(function() { 
        var $document = $(document),
            $element = $('.toggle-menu'),
            $element2 = $('header'),
            className = 'hasScrolled';

        $document.scroll(function() {
            $element.toggleClass(className, $document.scrollTop() >= 1);
            $element2.toggleClass(className, $document.scrollTop() >= 1);
        });
    });

    /*---------------------------
                                  File input logic
    ---------------------------*/
    $('input[type=file]').each(function(index, el) {
        $(this).on('change', function(event) {
            event.preventDefault();
            var placeholder = $(this).siblings('.placeholder');
        
            if ( this.files.length > 0 ) {
                if ( this.files[0].size < 5000000 ) {
                    var filename = $(this).val().split('/').pop().split('\\').pop();
                    if ( filename == '' ) {
                        filename = placeholder.attr('data-label');
                    }
                    placeholder.text(filename);
                } else {
                    alert('Maximum file size is 5Mb');
                }    
            } else {
                placeholder.text( placeholder.attr('data-label') );
            }
            
        });
    });
    
    /*---------------------------
                                PAGE ANCHORS
    ---------------------------*/
    $('.page-menu a, .anchor').click(function() {
        $('html, body').animate({
            scrollTop: $($(this).attr('href')).offset().top - 50
        }, 800);
        return false;
    });


    /*---------------------------
                                    Accordeon
    ---------------------------*/
    $('.js-faq-handler').on('click', function(event) {
        event.preventDefault();
        var content = $(this).siblings('.faq-item-content');
        $('.js-faq-handler').not($(this)).removeClass('is-open');
        $('.faq-item-content').not(content).slideUp();
        $(this).toggleClass('is-open');
        content.slideToggle();
    });


    /*---------------------------
                                    Fade-in-reviews
    ---------------------------*/
    $('.review').each(function(index, el) {
        $(this).delay(2000 * index).queue(function(next){
            $(this).addClass('is-visible')
            next();
        });
    });



    /*---------------------------
                                    Timer
    ---------------------------*/
    var endDate = new Date( $('.timer').attr('data-end') );
    $('.timer').countdown({
        until: endDate,
        padZeroes: true,
        format: 'dHMS',
        layout: '<span class="timer-section">'+
                    '<span class="timer-digits">'+
                        '<span>{d10}</span>'+
                        '<span>{d1}</span>'+
                    '</span>'+
                    '<span class="timer-section-label">{dl}</span>'+
                '</span>'+
                '<span class="timer-section">'+
                    '<span class="timer-digits">'+
                        '<span>{h10}</span>'+
                        '<span>{h1}</span>'+
                    '</span>'+
                    '<span class="timer-section-label">{hl}</span>'+
                '</span>'+
                '<span class="timer-section">'+
                    '<span class="timer-digits">'+
                        '<span>{m10}</span>'+
                        '<span>{m1}</span>'+
                    '</span>'+
                    '<span class="timer-section-label">{ml}</span>'+
                '</span>'+
                '<span class="timer-section">'+
                    '<span class="timer-digits">'+
                        '<span>{s10}</span>'+
                        '<span>{s1}</span>'+
                    '</span>'+
                    '<span class="timer-section-label">{sl}</span>'+
                '</span>'
    }); 


    /*---------------------------
                                  MENU TOGGLE
    ---------------------------*/
    $('.js-toggle-menu').on('click', function(event) {
        event.preventDefault();
        $(this).toggleClass('is-active');
        $(this).siblings('header').toggleClass('open');
    });


    /*---------------------------
                                  Chart
    ---------------------------*/
    var ctx = $("#myChart");

    var chart_wow = new WOW(
      {
        boxClass:     'js-chart',      // animated element css class (default is wow)
        animateClass: 'animated', // animation css class (default is animated)
        offset:       150,          // distance to the element when triggering the animation (default is 0)
        mobile:       true,       // trigger animations on mobile devices (default is true)
        live:         true,       // act on asynchronously loaded content (default is true)
        callback:     function(box) {
            var myPieChart = new Chart(ctx,{
                type: 'doughnut',
                data: chart_data,
                options: {
                    legend: {
                        display: false
                    },
                    animation: {
                        onComplete: function(animation) {
                            $('.js-chart').addClass('completed');
                        }
                    }
                }
            });
        },
        scrollContainer: null // optional scroll container selector, otherwise use window
      }
    );
    chart_wow.init();



    /*---------------------------
                                  Fancybox
    ---------------------------*/
    $('.fancybox').fancybox({
        
    });


    /**
     *
     * Open popup
     *
     * @param popup {String} jQuery object (#popup)
     *
     * @return n/a
     *
    */
    function openPopup(popup){
        $.fancybox.open([
            {
                src  : popup,
                type: 'inline',
                opts : {}
            }
        ], {
            loop : false
        });
    }


    function copyToClipboard(element) {
        var $temp = $("<input>");
        $("body").append($temp);
        $temp.val($(element).text()).select();
        document.execCommand("copy");
        $temp.remove();
        alert('Contract Address has been copied to your clipboard, please double check the contract address below: ' + $(element).text() );
    }

    $('.js-copy-code').on('click', function(event) {
        event.preventDefault();
        var target = $(this).attr('href');

        copyToClipboard(target);
    });



    /*---------------------------
                                  Form submit
    ---------------------------*/
    $('.ajax-form').on('submit', function(event) {
        event.preventDefault();
        var data = new FormData(this);
        $(this).find('button').prop('disabled', true);
        $.ajax({
            url: theme.url + '/forms.php',
            type: 'POST',
            data: data,
            cache: false,
            contentType: false,
            processData: false,
            success: function(result) {
                if (result.status == 'ok') {
                    openPopup('#modal-popup-ok')
                } else {
                    openPopup('#modal-popup-error')
                }
            },
            error: function(result) {
                openPopup('#modal-popup-error');
            }
        }).always(function() {
            $('form').each(function(index, el) {
                $(this)[0].reset();
                $(this).find('button').prop('disabled', false);
            });
        });
    });


    $(".content-scroll").mCustomScrollbar({
        theme:"minimal-dark"
    });



    if ( localStorage.getItem("acception") == 'true' ) {
        $('#terms-of-contribution input[type="checkbox"]').each(function(index, el) {
            $(this).prop('checked', true)
            $('#terms-of-contribution .green-button').removeClass('disabled');
            //$('#terms-of-contribution .green-button').attr('href', 'crowdsale.php');
            $('#terms-of-contribution .green-button').attr('href', 'https://docs.google.com/forms/d/e/1FAIpQLSdF_g8EvhKNisQLeuO5rbSSAzWqpWImHwmhX7ss2guXqfvoKg/viewform?usp=sf_link');
        }); 
    }

    $('#terms-of-contribution input[type="checkbox"]').on('change', function(event) {
        event.preventDefault();
        var accepted = false;

        if ( $('#terms-of-contribution input[type="checkbox"]:checked').length == $('#terms-of-contribution input[type="checkbox"]').length) {
           accepted = true;
        }

        if ( accepted ) {
            $('#terms-of-contribution .green-button').removeClass('disabled');
            $('#terms-of-contribution .green-button').attr('href', 'crowdsale.php');
            localStorage.setItem("acception", true);
        } else {
            $('#terms-of-contribution .green-button').addClass('disabled');
            $('#terms-of-contribution .green-button').attr('href', '');
            localStorage.setItem("acception", false);
        }
    }); 


}); // end file