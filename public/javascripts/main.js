// Code for Carousel using jquery and owl-carousel
$(document).ready(function(){
    $('.owl-carousel').owlCarousel({
      loop:true,
      autoplay:true, // Add this line to enable autoplay
      autoplayTimeout:3000,
      responsive:{
        0:{
          items:1
        },
        600:{
          items:1
        },
        1000:{
          items:1
        }
      }
    });
  });


  document.addEventListener("DOMContentLoaded", function() {
    const postLinks = document.querySelectorAll(".post-link");
   
    postLinks.forEach(function(link) {
        link.addEventListener("click", function(event) {
            event.preventDefault(); // Prevent the default action (navigation)
  
            const id = link.getAttribute("event_id");
  
            // Prepare the data object to send in the POST request
            const data = {
                id: id,
            };
  
            // Create a hidden form element
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = '/go'; // Replace with your endpoint URL
  
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
  

//Code to dump expired event in past events
document.addEventListener("DOMContentLoaded", function() {
    
  const e = document.getElementById("shift");
  const id = e.getAttribute("event_id");

          // Prepare the data object to send in the POST request
          const data = {
              id: id,
          };

          // Create a hidden form element
          const form = document.createElement('form');
          form.method = 'POST';
          form.action = '/shift'; 

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
