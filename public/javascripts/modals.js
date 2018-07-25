//modals.js

domIsReady(function() {

 	let editrecord = document.querySelectorAll('.edit')
	let delrecord = document.querySelectorAll('.delete')
	let modal1 = document.querySelector('.modal1')
	let modal2 = document.querySelector('.modal2')
	let addColor = document.querySelector('.addColor')
	let removeColor = document.querySelectorAll('.removeColor')
	let colorGroup = document.querySelector('#colorGroup')
	let colorIndex = 1;

	const postAjax = (url, data, success) => {
		var params = typeof data == 'string' ? data : Object.keys(data).map(
            function(k){ return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) }
	        ).join('&');

	    var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
	    xhr.open('POST', url);
	    xhr.onreadystatechange = function() {
	        if (xhr.readyState>3 && xhr.status==200) { success(xhr.responseText); }
	    };
	    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
	    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	    xhr.send(params);
	    return xhr;
	}

	// Removes modal
	const closeModal = (e) => {
	    modal1.style.display = 'none';
	    modal2.style.display = 'none';
	    setTimeout(() => {
		    let el = document.querySelectorAll('.inputColor');
		    Array.from(el).map(x => {
		    	x.remove()
		    });
		    colorIndex = 1;
	    }, 20)
	    addColor.addEventListener('click', addColorInput)
	}

	// Removes modal when clicking outside the window
	const outsideClick = (e) => {
	    if(e.target == modal1 || e.target == modal2){
	    	e.preventDefault();
	    	closeModal()
	    }
	}

	const removeColorInput = (e) => {
		e.stopPropagation();
		e.preventDefault();
		let target = e.target.getAttribute('data-colorId');
		modal1.querySelector(`#${target}`).remove()
		e.target.remove()
		e.target.removeEventListener('click', removeColorInput);
	}

	
	const addColorInput = () => {

		colorIndex++;
		let newEl = document.createElement(`input`);
		newEl.appendChild(document.createTextNode('0,0,0'));
		colors.appendChild(newEl);
		newEl.setAttribute("type", `color`);
		newEl.setAttribute("id", `color${colorIndex}`);
		newEl.setAttribute("name", `color`);
		newEl.setAttribute("value", `${0,0,0}`);
		newEl.className = 'form-control';
		newEl.className += ' inputColor';

		let removeBtn = document.createElement(`button`);
		removeBtn.appendChild(document.createTextNode('x'));
		colors.appendChild(removeBtn);
		removeBtn.setAttribute("id", `removebtn${colorIndex}`);
		removeBtn.setAttribute("data-colorId", `color${colorIndex}`);
		removeBtn.className = 'removeColor';
		removeBtn.className += ' inputColor';
		removeBtn.onclick = removeColorInput;
	}

	function fixString2Array (arg) {
	    return JSON.parse(`[${arg}]`)
	}
		
	const openModal1 = (e) => {
		let targetRow;
		//console.log(e.target.parentNode.nodeName.toLowerCase(), e.target.parentNode.nodeName.toLowerCase() === 'td')
		if (e.target.parentNode.nodeName.toLowerCase() === 'td') {
			targetRow =  e.target.parentElement.parentElement
			console.log(targetRow)
		} else {
			let tableMain = document.querySelector('.mainTable tbody')
			idBtn = e.target.getAttribute('data-key')
			targetRow = tableMain.querySelector(`[data-key='${idBtn}']`).parentElement
			//console.log(tableMain.querySelector(`[data-key='${idBtn}']`).parentElement)
		}
		//let targetRow =  e.target.parentElement.parentElement
		let idVal = targetRow.querySelector('._id').textContent
		let plcFunctionVal = targetRow.querySelector('.plcFunction').textContent
		let colorVal = targetRow.querySelector('.color').textContent.split(',')
		// let colorVal1 = colorVal[0].toString()
		// let colorVal2 = colorVal[1].toString()
		// let colorVal3 = colorVal[2].toString()

		// console.log(colorVal1)
		let outputTypeVal = targetRow.querySelector('.outputType').textContent
		let timingVal = targetRow.querySelector('.timing').textContent

		let idInput = modal1.querySelector('#_id')
		idInput.value = idVal

		let plcFunctionInput = modal1.querySelector('#plcFunction')
		plcFunctionInput.value = plcFunctionVal

		let colors = document.querySelector('#colors')
		colorVal.map((x, index) => {
			let newEl = document.createElement(`input`);
			newEl.appendChild(document.createTextNode(x));
			colors.appendChild(newEl);
			newEl.setAttribute("type", `color`);
			newEl.setAttribute("id", `color${index + 1}`);
			newEl.setAttribute("value", `${x}`);
			newEl.setAttribute("name", `color`);
			newEl.className = 'form-control';
			newEl.className += ' inputColor';
			if (index > 0) {
				let removeBtn = document.createElement(`button`);
				removeBtn.appendChild(document.createTextNode('x'));
				colors.appendChild(removeBtn);
				removeBtn.setAttribute("type", `button`);
				removeBtn.setAttribute("id", `removebtn${index + 1}`);
				removeBtn.setAttribute("data-colorId", `color${index + 1}`);
				removeBtn.className = 'removeColor';
				removeBtn.className += ' inputColor';
				removeBtn.onclick = removeColorInput
			}
			addColor.addEventListener('click', addColorInput)
		})
		
		//input#color1.form-control(type='color', placeholder='', name='color', value=color1, required)

		// let colorInput1 = modal1.querySelector('#color1')
		// colorInput1.value = colorVal1

		// let colorInput2 = modal1.querySelector('#color2')
		// colorInput2.value = colorVal2

		// let colorInput3 = modal1.querySelector('#color3')
		// colorInput3.value = colorVal3

		let outputTypeInput = modal1.querySelector('#outputType')
		outputTypeInput.value = outputTypeVal

		let timingInput = modal1.querySelector('#timing')
		timingInput.value = timingVal

		modal1.style.display = 'block'
	}

	const openModal2 = (e) => { 
		let idVal = e.target.parentElement.parentElement.querySelector('#_id').textContent
		let idInput = modal2.querySelector('#_id')
		idInput.value = idVal
		modal2.style.display = 'block'
	}
	
	window.addEventListener('click', outsideClick)

	let closeBtn = document.getElementById('closeBtn')
	let closeBtn1 = document.getElementById('closeBtn1')
	closeBtn.addEventListener('click', closeModal)
	closeBtn1.addEventListener('click', closeModal)

	if (addColor) {
		addColor.addEventListener('click', addColorInput)
	}

	
	if (editrecord) {
		Array.from(editrecord).map((x, index) => {
			if (index >= 0) {
				x.addEventListener('click', openModal1)
			}
		})
	}

	if (delrecord) {
		Array.from(delrecord).map((x, index) => {
			if (index >= 0) {
				x.addEventListener('click', openModal2)
			}
		})
	}

	
	let cardCollapse = document.querySelectorAll('.card-collapse')
	let cardDiv = document.querySelectorAll('.card-div')

	if (cardCollapse) {
		Array.from(cardCollapse).map((x, index) => {
			if (index >= 0) {
				x.addEventListener('click', function(e){
					let card = e.target.parentElement.parentElement.parentElement
					if (card.querySelector('.card-div').style.display == 'block'){
						card.querySelector('.card-div').style.display = 'none'
						e.target.innerHTML = '&#9660';
					} else {
						card.querySelector('.card-div').style.display = 'block'
						e.target.innerHTML = '&#9650';
					}

				})
			}
		})
	}

	let testColor = document.querySelectorAll('.test-color')

	const handleTest = (e) => {
		let dataToSend = 2**(e.target.getAttribute('data-key')-1)
		if (e.target.style.backgroundColor == "red") {
			postAjax('http://192.168.1.193:3030/pdata', `d=0`, function(data){ console.log(data); });
			e.target.style.backgroundColor = "white"
		} else {
			postAjax('http://192.168.1.193:3030/pdata', `d=${dataToSend}`, function(data){ console.log(data); });
			e.target.style.backgroundColor = "red"
		}
		// console.log(e.target.getAttribute('data-key'), dataToSend.toString(2))
	}

	if (testColor) {
		Array.from(testColor).map((x, index) => {
			if (index >= 0) {
				x.addEventListener('click', handleTest)
			}
		})
	}

	
})


