function dragMoveListener (event) {
    var target = event.target,
        // keep the dragged position in the data-x/data-y attributes
        x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
        y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    // translate the element
    target.style.webkitTransform =
    target.style.transform =
      'translate(' + x + 'px, ' + y + 'px)';

    // update the posiion attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
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