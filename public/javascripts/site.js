//site.js

var domIsReady = function(callback) {
            document.readyState === "interactive" || document.readyState === "complete" 
            ? callback() 
            : document.addEventListener("DOMContentLoaded", callback);
};

domIsReady(function() {
	let re = /(\/[a-zA-Z]+|(\/))/ 
	let urlLocation = window.location.href.slice(7).match(re)
	let nav = document.querySelector(".nav")
	let navLinks = nav.querySelectorAll('.nav-link')
	Array.from(navLinks).map(el => {
		if(el.getAttribute("href") == urlLocation[0]){ 
			el.parentNode.style.backgroundColor = '#909090'
		}else {
			el.parentNode.style.backgroundColor = ''
		}
	})
	let cacheBust = () => Math.floor(Math.random(1000) * 99999)
})