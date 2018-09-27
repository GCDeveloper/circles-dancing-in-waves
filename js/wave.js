(function () {
	'use strict';
  let looping = true;
  let secondsElapsed = 0;
  let canvas, ctx, width, height;
  const DRAW = {
  copy: function(sctx, sx,sy,w,h, dctx, dx,dy){
    var imgData=sctx.getImageData(sx, sy, sw, sh);
    dctx.putImageData(imgData,dx,dy);
  },
  circle: function(objCircle) {
    ctx.arc(objCircle.x, objCircle.y, objCircle.radius, 0,  Math.PI * 2);
  },
  //draws a shape at position xpos,ypos with numSide lines (e. 3 for triangle), at numSize pixels widths and height, at rotation numRotation
  regularShape: function(xPos, yPos, numSides, numSize, numRotation){
    var i = 0;
    ctx.moveTo(xPos+Math.sin((i/numSides)*Math.PI*2+numRotation)*numSize, yPos+Math.cos((i/numSides)*Math.PI*2+numRotation)*numSize);
    for(i = 0;i<numSides+1;i++){
      ctx.lineTo(xPos+Math.sin((i/numSides)*Math.PI*2+numRotation)*numSize, yPos+Math.cos((i/numSides)*Math.PI*2+numRotation)*numSize);
    }
  }
};
	//request animation frames for all browsers/platforms with setTimeout fallback
	window.requestAnimFrame = (function(){
	  return  window.requestAnimationFrame       ||
			  window.webkitRequestAnimationFrame ||
			  window.mozRequestAnimationFrame    ||
			  window.oRequestAnimationFrame      ||
			  window.msRequestAnimationFrame     ||
			  function( callback ){
				window.setTimeout(callback, 1000 / 30);//30 times per second
			  };
	})();
	//capture any errors found when running the program, push them to console and give alert box if G.blnDebug is true
	window.onerror = function(msg) {
		console.warn("Error: "+msg);
		alert("Error: " + msg);
	};
	//force remove scrolling (if they cannot be disabled by other means), (set back to 0, 0).
	window.onscroll = function(){
		console.log("Scrolled!, setting scroll to 0, 0");
		window.scrollTo(0, 0);
	};

  window.addEventListener('load', onWindowLoaded, false);
  window.addEventListener('resize', onWindowResized, false);
  function onWindowLoaded(){
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext('2d');
    console.log("load evt fired", canvas, ctx);
    onWindowResized();
    if(looping) loop();
  }
  function onWindowResized(){
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    console.log("resized");
  }
  function createPoint(ms, i = 0){
    let freq = width*(0.1);
    let radius = i/1000/(ms)+5;
    let x = (ms/width+(i*5))%width;
    let y = height/2+Math.sin(i/10)*(radius/5)*(height/10);

    return { x, y, radius, freq };
  }
  function loop(ms = 0) {
    let points = [];
    for(let i = 0; i< Math.round(width*0.025);i++){
      points.push(createPoint(ms, i*(ms/1000)));
    }
    if(ms === 0 || Math.floor(ms/1000) > secondsElapsed) {
      secondsElapsed = Math.floor(ms/1000)
      console.log("seconds elapsed", secondsElapsed);
      if(secondsElapsed%60==0) console.log("minutes elapsed", secondsElapsed/60);
    }
    ctx.clearRect(0,0,width,height);
    points.forEach((point, i)=>{

      ctx.strokeStyle = `rgb(${100+(i*Object.keys(points).length)}, ${200}, 250)`;
      ctx.beginPath();

      ctx.moveTo(point.x+point.radius, point.y);
      DRAW.circle({x: point.x, y: point.y, radius: point.radius});
      ctx.closePath();
      ctx.stroke();
    });
    //}
    if(looping) requestAnimFrame(loop);
  };
}());
