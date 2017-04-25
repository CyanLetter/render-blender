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

	blend.background = new PIXI.Container();
	blend.stage.addChild(blend.background);

	// create a new sprite that uses the render texture we created above
	blend.outputSprite = new PIXI.Sprite(blend.renderTexture);
	blend.stage.addChild(blend.outputSprite);

	blend.blendContainer = new PIXI.Container();
	blend.stage.addChild(blend.blendContainer);

	// addCircles();
	// addRings();
	// redlineGraphic();
	// splotch();
	// reveal();

	update();
};

function clearRenderTexture() {
	blend.stage.removeChild(blend.outputSprite);
	blend.renderTexture = PIXI.RenderTexture.create(960, 540);
	blend.outputSprite = new PIXI.Sprite(blend.renderTexture);
	blend.stage.addChild(blend.outputSprite);
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
};

function reveal(mode) {
	console.log("revealing");

	if (typeof mode === "undefined") {
		mode = "burst";
	}
	// mode: burst, spiral, godray

	clearRenderTexture();
	if (blend.bgimg) {
		blend.background.removeChild(blend.bgimg);
	}
	blend.bgimg = new PIXI.Sprite.fromImage('assets/images/beetle.jpg');

	blend.bgimg.anchor.x = 0.5;
	blend.bgimg.anchor.y = 0.5;
	blend.bgimg.position.x = 480;
	blend.bgimg.position.y = 270;
	blend.background.addChild(blend.bgimg);
	blend.bgimg.mask = blend.outputSprite;

	var modeSettings;

		switch (mode) {
			case "burst":
				modeSettings = {
					count: 36,
					scaleEase: Power2.easeOut,
					rotation: 0,
					startX: 480,
					startY: 270
				};
			break;
			case "spiral":
				modeSettings = {
					count: 36,
					scaleEase: Linear.easeNone,
					rotation: 3,
					startX: 480,
					startY: 270
				};
			break;
			case "godray":
				modeSettings = {
					count: 24,
					scaleEase: Power2.easeOut,
					rotation: 0,
					startX: 0,
					startY: 0
				};
			break;
			default:

			break;
		}

	// reveal splotch

	var splotchContainer = new PIXI.Container();
	splotchContainer.position.x = modeSettings.startX;
	splotchContainer.position.y = modeSettings.startY;
	// blend.blendContainer.addChild(splotchContainer);

	for(var i = 0; i < modeSettings.count; i++) {
		var newRad = (10 + (Math.random() * 25));
		
		var magnitute, newX, newY, startX, startY, scaleTo;

		switch (mode) {
			case "burst":
				var rot = (i / modeSettings.count) * 6.28;
				magnitude = 100 + (Math.random() * 270);
				newX = Math.sin(rot) * magnitude;
				newY = Math.cos(rot) * magnitude;
				startX = 0;
				startY = 0;
				scaleTo = 0;
			break;
			case "spiral":
				var rot = (i / modeSettings.count) * 6.28;
				magnitude = 100 + (Math.random() * 270);
				newX = Math.sin(rot) * magnitude;
				newY = Math.cos(rot) * magnitude;
				startX = 0;
				startY = 0;
				scaleTo = 0;
			break;
			case "godray":
				newX = 480 + (Math.random() * 960);
				newY = 540 * (i / modeSettings.count);
				startX = 0;
				startY = newY;
				scaleTo = 1;
			break;
			default:

			break;
		}

		var cOuter = new PIXI.Graphics();
		cOuter.alpha = 0.05;
		cOuter.beginFill(0xffffff);
		cOuter.drawCircle(0, 0, newRad);
		cOuter.scale.x = 1;
		cOuter.scale.y = 1;
		cOuter.position.x = startX;
		cOuter.position.y = startY;
		splotchContainer.addChild(cOuter);
		TweenMax.to(cOuter.scale, 4, {
			x: scaleTo, 
			y: scaleTo, 
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
				tween.target.x += Math.random() * 20;
				tween.target.y += Math.random() * 20;
			},
			onUpdateParams:["{self}"]
		});
	}

	var srt = PIXI.RenderTexture.create(960, 540);
	var srtSprite = new PIXI.Sprite(srt);
	srtSprite.anchor.x = 0.5;
	srtSprite.anchor.y = 0.5;
	srtSprite.position.x = 480;
	srtSprite.position.y = 270;
	srtSprite.scale.x = 0.5;
	srtSprite.scale.y = 0.5;
	blend.blendContainer.addChild(srtSprite);

	TweenMax.to(srtSprite.scale, 4, {
		x: 3, 
		y: 3, 
		ease: modeSettings.scale, 
		onUpdate: function(){
			// splotchContainer.setTransform();
			blend.app.renderer.render(splotchContainer, srt, false);
		},
		onComplete: function(){
			blend.blendContainer.removeChild(srtSprite);
		}
	});
	TweenMax.to(srtSprite, 4, {
		alpha: 0,
		rotation: modeSettings.rotation
	});

	TweenMax.fromTo(blend.bgimg.scale, 4, {
		x: 1,
		y: 1
	}, {
		x: 1.2,
		y: 1.2
	});
};

function pixelRain() {
	clearRenderTexture();

	if (blend.bgimg) {
		blend.background.removeChild(blend.bgimg);
	}
	blend.bgimg = new PIXI.Sprite.fromImage('assets/images/drifter.jpg');
	blend.bgimg.anchor.x = 0.5;
	blend.bgimg.anchor.y = 0.5;
	blend.bgimg.position.x = 480;
	blend.bgimg.position.y = 270;
	blend.background.addChild(blend.bgimg);
	blend.bgimg.mask = blend.outputSprite;

	var rainContainer = new PIXI.Container();
	var pixelSize = 5;

	for(var i = 0; i < 960 / pixelSize; i++) {

		var newY = 360 + (Math.random() * 180);

		var drop = new PIXI.Graphics();
		drop.alpha = 0.05;
		drop.beginFill(0xffffff);
		drop.drawRect(0, 0, pixelSize, pixelSize);
		drop.position.x = i * pixelSize;
		rainContainer.addChild(drop);
		TweenMax.to(drop.position, 6, {
			y: newY, 
			ease: Linear.easeNone,
			onComplete: function(){
				rainContainer.removeChildren();
			}
		});
	}

	var srt = PIXI.RenderTexture.create(960, 540);
	var srtSprite = new PIXI.Sprite(srt);
	srtSprite.anchor.x = 0.5;
	srtSprite.anchor.y = 0.5;
	srtSprite.position.x = 480;
	srtSprite.position.y = 270;
	blend.blendContainer.addChild(srtSprite);

	TweenMax.to(srtSprite.position, 6, {
		y: 270, 
		onUpdate: function(){
			blend.app.renderer.render(rainContainer, srt, false);
		},
		onComplete: function(){
			blend.blendContainer.removeChild(srtSprite);
		}
	});
}

 
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