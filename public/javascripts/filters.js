domIsReady(function() {
	//give tbody class rows of tblRows
	//give inputs and body td id as first attribute.
	// make sure input type='search' is second attribute.

	let searchInputs = document.querySelectorAll(`input[type='search']`)//if (item != "_schema" || item != "_id")
	let tableRows = document.querySelectorAll(`.tblRow1`)
	let tableRowsArray = Array.from(tableRows)
	let filterArray = Array.from(searchInputs)

	function createFilterObj(){
		let obj = []
		filterArray.map(x => {
			let val = x.value.toLowerCase()
			let key = x.attributes[0].value
			obj.push([key, val])
		})
		return obj
	}

	function filterRows(){
		let filterObj = createFilterObj()
		let matchArray = []

		tableRowsArray.map(row => {
			matchArray = []
			let test = true
			let rowArray = row.querySelectorAll('td')
			let rowIdArray = Array.from(rowArray).map((data) => data.id) 

			//  filters out table columns that don't hava a filter
			Array.from(rowArray).filter((data) => {
				let testField = filterObj.find(element => element[0] === data.getAttribute('id'))
				if (testField != undefined) {
					return true
				} else {
					return false
				}
			})// maps cell content to an array with id and data
			.map(cellData => cellData.textContent 
			? [cellData.getAttribute('id'), cellData.textContent.toLowerCase()]
			: [cellData.getAttribute('id'),""]
			) // map over remaining cells in array to check for matches
			.map((x, index) => {
				
				if (filterObj[index][1] == "" || x[1].match(filterObj[index][1]) != null) {
					matchArray.push('true')
				}
				else{
					matchArray.push('false')
				}
			})
			return matchArray.includes('false') ? row.style.display = 'none' : row.style.display = ''
		})
	}


	filterArray.map((x, index) => {
		if (index >= 0) {
			x.addEventListener('keyup', (e) => {
				filterRows()
			})
		}
	})
})