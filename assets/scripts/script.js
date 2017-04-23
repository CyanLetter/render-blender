var blend = blend || {};

var colorThemes = {
	meteor: [
		0x382719,
		0xff0280,
		0xff2828,
		0xfcc500,
		// 0xfc00c1
	],
	bahamas: [
		0x00f7e6,
		0x00f79c,
		0xaad100,
		0xf4de11,
		0x0099f2
	],
	winter: [
		0xadcbdb,
		0x8cfdff,
		0x99a3a2,
		0x66a9d1
	],
	solar: [
		0xff6a00,
		0xb53300,
		0x680e0e,
		0xd81717,
		0xffe100
	],
	bright: [
		0xff0280,
		0xff2828,
		0xfcc500,
		0x00f7e6,
		0x00f79c,
		0xaad100,
		0xff6a00
	]
}

function startPixi() {
	blend.app = new PIXI.Application(960, 540, { antialias: true, forceCanvas: false });

	blend.app.view.id = "pixi-canvas";

	document.body.appendChild(blend.app.view);

	blend.canvas = document.getElementById("pixi-canvas");

	blend.stage = new PIXI.Container();

	blend.app.renderer.backgroundColor = 0xFFFFFF;

	blend.renderTexture = PIXI.RenderTexture.create(960, 540);

	// create a new sprite that uses the render texture we created above
	blend.outputSprite = new PIXI.Sprite(blend.renderTexture);
	blend.stage.addChild(blend.outputSprite);

	blend.blendContainer = new PIXI.Container();
	blend.stage.addChild(blend.blendContainer);

	// addCircles();
	// addRings();
	// redlineGraphic();
	splotch();

	update();
};

function makeBackground() {

};

function addCircles() {
	var xPos = Math.random() * 100;
	var yPos = Math.random() * 540;
	var radius = 2 + (Math.random() * 100);

	var circle = new PIXI.Graphics();
	circle.blendMode = PIXI.BLEND_MODES.OVERLAY;
	circle.alpha = 0.01;
	circle.beginFill(colorThemes.bahamas[Math.floor(Math.random() * colorThemes.bahamas.length)]);
	circle.drawCircle(0, 0, radius);
	circle.position.x = xPos;
	circle.position.y = yPos;
	blend.blendContainer.addChild(circle);
	circle.scale.x = 0;
	circle.scale.y = 0;


	TweenMax.to(circle.position, 10, {x: 1400, ease: Power1.easeIn});
	TweenMax.to(circle.scale, 2, {x: 1, y: 1, ease: Power2.easeOut});
	TweenMax.delayedCall(1, addCircles);
};

function addRings() {
	var xPos = Math.random() * 960;
	var yPos = Math.random() * 540;
	var radius = 2 + (Math.random() * 40);
	var ringOffset = radius + (Math.random() * 250);
	var initialRot = Math.random() * 6.28;
	var rot = initialRot + 3.14 + (Math.random() * 6.28);

	var rect = new PIXI.Graphics();
	rect.blendMode = PIXI.BLEND_MODES.OVERLAY;
	rect.alpha = 0.01;
	rect.beginFill(colorThemes.meteor[Math.floor(Math.random() * colorThemes.meteor.length)]);
	rect.drawRect(ringOffset, -radius, radius * 2, radius * 2);
	rect.position.x = xPos;
	rect.position.y = yPos;
	rect.rotation = initialRot;
	blend.blendContainer.addChild(rect);

	TweenMax.to(rect, 15 + (3 / radius), {rotation: rot, ease: Power2.easeOut, onComplete: function(){
		blend.blendContainer.removeChild(rect);
	}});
	TweenMax.to(rect, 3, {alpha: 0, delay: 11 + (2.9 / radius)});
	TweenMax.delayedCall(0.5, addRings);
};

function splotch() {
	var radius = 50 + (Math.random() * 100);
	var xPos = Math.random() * 960;
	var yPos = Math.random() * 540;
	var color = colorThemes.bright[Math.floor(Math.random() * colorThemes.bright.length)];

	var splotchContainer = new PIXI.Container();
	splotchContainer.position.x = radius + 50;
	splotchContainer.position.y = radius + 50;
	// blend.blendContainer.addChild(splotchContainer);

	blend.splotchContainer = splotchContainer;

	// var cMain = new PIXI.Graphics();
	// cMain.blendMode = PIXI.BLEND_MODES.ADD;
	// cMain.alpha = 0.03;
	// cMain.beginFill(color);
	// cMain.drawCircle(0, 0, radius / 3);
	// cMain.scale.x = 0;
	// cMain.scale.y = 0;
	// splotchContainer.addChild(cMain);
	// TweenMax.to(cMain.scale, 2, {x: 1, y: 1, ease: Power2.easeOut});
	// TweenMax.to(cMain, 2, {alpha: 0, ease: Power2.easeIn, onComplete: function(){
	// 	splotchContainer.removeChild(cMain);
	// }});

	TweenMax.delayedCall(0.2, function(){
		for(var i = 0; i < 10; i++) {
			var newRad = radius * (0.1 + (Math.random() * 0.2));
			var newX = Math.random() * radius;
			var newY = (radius - newX) * (Math.random() > 0.5 ? -1 : 1);
			newX *= Math.random() > 0.5 ? -1 : 1;

			var cOuter = new PIXI.Graphics();
			cOuter.blendMode = PIXI.BLEND_MODES.OVERLAY;
			cOuter.alpha = 0.05;
			cOuter.beginFill(color);
			cOuter.drawCircle(0, 0, newRad);
			cOuter.scale.x = 1;
			cOuter.scale.y = 1;
			splotchContainer.addChild(cOuter);
			TweenMax.to(cOuter.scale, 4, {
				x: 0, 
				y: 0, 
				ease: Power3.easeOut, 
				onComplete: function(){
					splotchContainer.removeChildren();
				}
			});
			TweenMax.to(cOuter.position, 4, {
				x: newX, 
				y: newY, 
				ease: Power3.easeOut,
				onUpdate: function(tween){
					tween.target.x += Math.random() * 10;
					tween.target.y += Math.random() * 10;
				},
				onUpdateParams:["{self}"]
			});
			// TweenMax.to(cOuter, 2, {alpha: 0, ease: Power2.easeIn});
		}
	});

	var srt = PIXI.RenderTexture.create((radius * 2) + 100, (radius * 2) + 100);
	// srt.position.x = xPos;
	// srt.position.y = yPos;
	var srtSprite = new PIXI.Sprite(srt);
	// srtSprite.blendMode = PIXI.BLEND_MODES.MULTIPLY;
	srtSprite.anchor.x = 0.5;
	srtSprite.anchor.y = 0.5;
	srtSprite.position.x = xPos;
	srtSprite.position.y = yPos;
	srtSprite.scale.x = 0.5;
	srtSprite.scale.y = 0.5;
	// srtSprite.alpha = 0.1;
	blend.stage.addChild(srtSprite);

	window.currentSplotchSprite = srtSprite;

	// var displacementSprite = PIXI.Sprite.fromImage('assets/images/displacement_map.jpg');
	// var displacementFilter = new PIXI.filters.DisplacementFilter(displacementSprite);
	// srtSprite.filters = [displacementFilter];

	TweenMax.to(srtSprite.scale, 4, {
		x: 2, 
		y: 2, 
		ease: Power2.easeOut, 
		onUpdate: function(){
			// splotchContainer.setTransform();
			blend.app.renderer.render(splotchContainer, srt, false);
		},
		onComplete: function(){
			blend.stage.removeChild(srtSprite);
			blend.app.renderer.render(srtSprite, blend.renderTexture, false);
		}
	});
	// TweenMax.to(srtSprite, 4, {
	// 	alpha: 0, 
	// 	ease: Power2.easeIn
	// });
};

function redlineGraphic() {
	var c1 = new PIXI.Graphics();
	c1.blendMode = PIXI.BLEND_MODES.ADD;
	c1.alpha = 0.02;
	c1.beginFill(0xff2828);
	c1.drawCircle(0, 0, 600);
	c1.position.x = 480;
	c1.position.y = 270;
	c1.scale.x = 0;
	c1.scale.y = 0;
	blend.blendContainer.addChild(c1);
	TweenMax.to(c1.scale, 2, {x: 1, y: 1, ease: Power2.easeOut, onComplete: function(){
		blend.blendContainer.removeChild(c1);
	}});

	// var c2 = new PIXI.Graphics();
	// c2.blendMode = PIXI.BLEND_MODES.SCREEN;
	// c2.alpha = 0.1;
	// c2.beginFill(0xffffff);
	// c2.drawCircle(0, 0, 240);
	// c2.position.x = 480;
	// c2.position.y = 270;
	// c2.scale.x = 0;
	// c2.scale.y = 0;
	// blend.blendContainer.addChild(c2);
	// TweenMax.to(c2.scale, 1.8, {x: 1, y: 1, delay: 0.2, ease: Power2.easeOut, onComplete: function(){
	// 	blend.blendContainer.removeChild(c2);
	// }});

	var c3 = new PIXI.Graphics();
	c3.blendMode = PIXI.BLEND_MODES.ADD;
	c3.alpha = 0.2;
	c3.beginFill(0xff0280);
	c3.drawCircle(0, 0, 210);
	c3.position.x = 480;
	c3.position.y = 270;
	c3.scale.x = 0;
	c3.scale.y = 0;
	blend.blendContainer.addChild(c3);
	TweenMax.to(c3.scale, 1.6, {x: 1, y: 1, delay: 0.4, ease: Power2.easeOut, onComplete: function(){
		blend.blendContainer.removeChild(c3);

		var r1 = new PIXI.Graphics();
		r1.blendMode = PIXI.BLEND_MODES.ADD;
		r1.alpha = 0.2;
		r1.beginFill(0xffff00);
		r1.drawPolygon([
			new PIXI.Point(-180, 10),
			new PIXI.Point(-180, -10),
			new PIXI.Point(10, -20),
			new PIXI.Point(10, 20)
		]);
		r1.position.x = 480;
		r1.position.y = 270;
		blend.blendContainer.addChild(r1);
		TweenMax.to(r1, 1.6, {rotation: 4, ease: Power2.easeOut});
	}});
};

 
function update() {
	// start the timer for the next animation loop
	requestAnimationFrame(update);

	// this is the main render call that makes pixi draw your container and its children.
	blend.app.renderer.render(blend.blendContainer, blend.renderTexture, false);
	blend.app.renderer.render(blend.stage);
};

window.onload = function() {
	startPixi();
}