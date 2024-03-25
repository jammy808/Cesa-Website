$(document).ready(function(){
    $('.owl-carousel').owlCarousel({
       // Add this line to enable autoplay
      autoplayTimeout:3000,
      margin: 10,
      responsive:{
        0:{
          items:3
        },
        600:{
          items:4
        },
        1000:{
          items:5
        }
      }
    });
  });


  document.addEventListener("DOMContentLoaded", function() {
    const postLinks = document.querySelectorAll(".a");
   
    postLinks.forEach(function(link) {
        link.addEventListener("click", function(event) {
            event.preventDefault(); // Prevent the default action (navigation)
  
            const post = link.getAttribute("post");
  
            // Prepare the data object to send in the POST request
            const data = {
                post: post,
            };
  
            // Create a hidden form element
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = '/fetchTeam'; // Replace with your endpoint URL
  
            // Create a hidden input field for each data attribute
            Object.keys(data).forEach(function(key) {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = key;
                input.value = data[key];
                form.appendChild(input);
            });
  
            // Append the form to the document body and submit it
            document.body.appendChild(form);
            form.submit();
       
        });
    });
  });
