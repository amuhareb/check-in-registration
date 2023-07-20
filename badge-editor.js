function dragMoveListener (event) {
  var target = event.target,
      // keep the dragged position in the data-x/data-y attributes
      x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
      y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

  // calculate the center point of the parent element
  var parentRect = target.parentNode.getBoundingClientRect();
  var parentCenterX = parentRect.left + parentRect.width / 2;

  // snap the dragged element to the center point
  var elementRect = target.getBoundingClientRect();
  var elementCenterX = elementRect.left + elementRect.width / 2;
  var offsetX = parentCenterX - elementCenterX;
  x += offsetX;

  // translate the element
  target.style.webkitTransform =
  target.style.transform =
    'translate(' + x + 'px, ' + y + 'px)';

  // update the position attributes
  target.setAttribute('data-x', x);
  target.setAttribute('data-y', y);

  // store the position data in localStorage
  localStorage.setItem(target.id + '-position-x', x);
  localStorage.setItem(target.id + '-position-y', y);
}

  interact('.draggable')
  .draggable({
    onmove: window.dragMoveListener,
    restrict: {
      restriction: 'parent',
      elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
    }
  })
  //upon clicking a draggable element, change the innerhtml of the currentElement div to the id of the clicked element
$('.draggable').click(function() {
  var currentElement = document.getElementById('currentElement');
  var currentSize = window.getComputedStyle(this, null).getPropertyValue('font-size');
  currentSizeNoPx = currentSize.replace('px', '');
  //set the innerhtml of the currentElement div to the id of the clicked element and it's font size
  currentElement.innerHTML = this.id + " " + currentSize;
  //set the slider value to the font size of the clicked element
  $('#myRange').val(currentSizeNoPx);
  //adjusting the slider changes the font size of the clicked element
  $('#myRange').on('input', function() {
    var currentElement = document.getElementById('currentElement');
    var currentElementId = currentElement.innerHTML.split(" ")[0];
    var currentElementSize = currentElement.innerHTML.split(" ")[1];
    var currentElementId = document.getElementById(currentElementId);
    currentElementId.style.fontSize = this.value + "px";
    currentElement.innerHTML = currentElementId.id + " " + this.value + "px";
  }
  );
});

//double click text to edit it
$('.draggable').dblclick(function() {
  var currentElement = document.getElementById('currentElement');
  var currentElementId = currentElement.innerHTML.split(" ")[0];
  var currentElementSize = currentElement.innerHTML.split(" ")[1];
  var currentElementId = document.getElementById(currentElementId);
  var currentElementText = currentElementId.innerHTML;
  var currentElementText = prompt("Edit text", currentElementText);
  currentElementId.innerHTML = currentElementText;
}
);

function restoreElementPositions() {
  // loop through all draggable elements
  var draggables = document.querySelectorAll('.draggable');
  for (var i = 0; i < draggables.length; i++) {
    var draggable = draggables[i];
    var id = draggable.id;

    // check if position data exists in localStorage
    var x = localStorage.getItem(id + '-position-x');
    var y = localStorage.getItem(id + '-position-y');
    if (x !== null && y !== null) {
      // set the position attributes of the element
      draggable.setAttribute('data-x', x);
      draggable.setAttribute('data-y', y);
      draggable.style.webkitTransform =
      draggable.style.transform =
        'translate(' + x + 'px, ' + y + 'px)';
    }
  }
}

// call the restoreElementFontSizes function on page load
window.onload = function() {
  restoreElementPositions();
};