'use strict';
var buffer_contents = ""
var input_enabled = true;
var decimal_mode = false;
var outof;

// Makes the cursor blink.
function blink_cursor() {
    if (input_enabled) {
        $('#cursor').fadeOut(500).fadeIn(500, blink_cursor);
    }
    else {
        $('#cursor').hide()
    }
}

// Sets buffer to text parameter
function set_buffer (text) {
    $('#buffer').html(text + '<span id="cursor">|</span>')
    buffer_contents = text
    blink_cursor()
}

// Calculates the percentage and updates screen
function calc () {
    var answer = parseInt(Math.round(parseFloat(buffer_contents)/parseFloat(outof)*100))
    $('#answer').text(answer +'%')
    $('#nohistory').remove();
    $('#history').prepend('<div class="row hrow text-light">\
<div class="col hcolor1">'+parseFloat(buffer_contents)+'</div>\
<div class="col hcolor2 vw">Out of</div>\
<div class="col hcolor3">'+parseFloat(outof)+'</div>\
<div class="col hcolor4">=</div>\
<div class="col hcolor5">'+answer+'%</div>\
</div>');
    set_buffer("")
}

$(document).ready(function(){
    // Enables Bootstrap tooltips
    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
    })

    console.log('ready')
    blink_cursor()
    $('#help-popover').popover('show')
    $('#showhelp').click(function(){$.when($('#help').toggle(400)).then(function(){
        if ($('#help').css('display') == 'none'){
            $('#outof-popover').popover('toggle')
            $('#outof-popover').popover('toggle')
        }
        
        else {
            $('#outof-popover').popover('toggle')
            $('#outof-popover').popover('toggle')
            $('#outof-popover').popover('toggle')
        }
        
    })
                                   })
    $('body').click(function(){$('#help-popover').popover('hide')
                               $('.overlay').hide()
                               $('#outof-popover').popover('show')})


    // Detects if a key is pressed
    $(document).keydown(function(event){
        if (input_enabled) {
            outof = $('#outof-box').text()
            // Sets cur_char to letter relating to the ASCII code of the key just pressed.
            var cur_char = String.fromCharCode(event.which)
            console.log(event.which)
            console.log(cur_char)
            // Fixes a problem where the character 190 (the code inputted when a full stop is entered, although not the ASCII code) is translated as a three-quarters symbol.
            if (event.which == 190) {
                cur_char = "."
            }
            
            // isNan returns true if the variable is non-numeric. ! is used to negate. 190 is a full stop, 13 is enter and 8 is backspace.
            if ((!isNaN(cur_char) || event.which == 190) && event.which != 13 && event.which != 8) {
                console.log('Is a number')
                buffer_contents = buffer_contents + cur_char
                set_buffer(buffer_contents)
                if (buffer_contents.length == outof.length && !decimal_mode) {
                    calc()
                }
            }
            
            // buffer_contents != '' is to prevent NaN (Not-a-Number) results.
            else if (event.which == 13 && buffer_contents != '') {
                calc()
            }
            
            // Enables/disables decimal mode
            else if (cur_char == 'd'|| cur_char == 'D'){
                if (decimal_mode) {
                    decimal_mode = false
                    $('.d-mode').css('display', 'none')
                }
                else {
                    decimal_mode = true
                    $('.d-mode').css('display', 'flex')
                }
            }
            
            // Backspace feature
            else if (event.which == 8) {
                event.preventDefault()
                buffer_contents = buffer_contents.slice(0, -1)
                set_buffer(buffer_contents)
            }
        }
    })

    // Turns outof box into an input when clicked
    function enable_setting_outof() {
        $('#outof-box').off('click')
        $('#outof-popover').popover('hide').popover('disable')
        input_enabled = false
        var outof = $('#outof-box').text()
        if (outof)
            $('#outof-box').html('<div id="outof-input-row inline-form"><div class="form-row"><input id="outof-input" class="form-control col" value="'+outof+'"><div class="invalid-feedback alert alert-danger">Not a number!</div><button class="btn btn-c3c col" id="set">Set</button></div></div>')
        // Sets value to itself, then focuses (this is to make the cursor go to the end of the line)
        $('#outof-input').val('').val(outof).focus()
        // Sets the outof value
        function set_outof() {
            if (isNaN($('#outof-input').val())) {
                console.log('if')
                $('#outof-input').toggleClass('is-invalid')
                $('#outof-input').val('').val(outof).focus()
            }
            else {
                console.log('else')
                $('#outof-box').html($('#outof-input').val())
                $('#outof-box').click(enable_setting_outof)
                input_enabled = true
                blink_cursor()
            }
        }
        // Triggers
        $('#set').mouseup(set_outof)
        $(document).keydown(function (event){
            if (event.which == 13){
                set_outof()
            }
        })
    }
    $('#outof-box').click(enable_setting_outof)
})