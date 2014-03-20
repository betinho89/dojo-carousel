var defaultSettings = {sPosition: "horizontal", bSameWidth: false, iMaxHeight: 500, iDuration: 5, iNumberImages: 3 };

function carousel(settings) {
	if(settings.sSource === undefined || settings.sTarget === undefined) {
		console.error("Error: El source y el target deben de estar definidos.");
	}
	else {
		require(["dojo/dom", "dojo/dom-attr", "dojo/dom-class", "dojo/query", "dojo/dom-geometry", "dojo/dom-style", "dojo/NodeList-manipulate", "dojo/_base/fx", "dojo/NodeList-fx"],
			function(dom, domAttr, domClass, query, domGeometry, domStyle, fx) {
				if(settings.sPosition === undefined) {settings.sPosition = defaultSettings.sPosition; }
				if(settings.bSameWidth === undefined) {settings.bSameWidth = defaultSettings.bSameWidth; }
				if(settings.iMaxHeight === undefined) {settings.iMaxHeight = defaultSettings.iMaxHeight; }
				if(settings.iDuration === undefined) {settings.iDuration = defaultSettings.iDuration; }
				if(settings.iNumberImages === undefined) {settings.iNumberImages = defaultSettings.iNumberImages; }

				var oTimer;
				var iTimer = ((settings.iDuration !== null && settings.iDuration > 0) ? settings.iDuration : 5);
				var iCurrent = 0;
				var iMaxSize = domGeometry.getContentBox(settings.sSource).w;
				var sDimension = (settings.sPosition === 'horizontal') ? "width" : "height";
				var oCarouselImages = query(".carousel-element", settings.sSource);
				var bHover = false;

				if(settings.sPosition === 'vertical') {
					if(settings.bSameWidth === false) {
						iMaxSize = settings.iMaxHeight;
					}
					domStyle.set(settings.sSource, "height", iMaxSize + "px");
				}

				var fSizeofImages = (90 / settings.iNumberImages).toFixed(5);
				var fPaddingofImages = (9 / settings.iNumberImages).toFixed(5);

				query("#" + settings.sSource).append("<div id='carousel-images-inner'></div>");
				domClass.add(settings.sSource, settings.sPosition);

				var iNumberContents = Math.ceil(oCarouselImages.length / settings.iNumberImages);
				domStyle.set("carousel-images-inner", sDimension, (iMaxSize * iNumberContents) + "px");

				query("#" + settings.sSource).prepend("<span class='control " + settings.sPosition + "' id='leftControl'></span>");
				query("#" + settings.sSource).append("<span class='control " + settings.sPosition + "' id='rightControl'></span>");

				var index = 0;
				var iCountImages = 0;
				var sIdContent = "";

				var oFirstImage = null;
				if(oCarouselImages.length > 0) {
					oFirstImage = oCarouselImages[0].cloneNode(true);
					domClass.add(oCarouselImages[0], "current");
				}
				for (var i = 0; i < iNumberContents; i++) {
					sIdContent = "carousel-content-" + String(i);
					iCountImages = 0;
					query("#carousel-images-inner").append("<div id='" + sIdContent + "' class='carousel-images-content'></div>");
					for (var j = index; j < oCarouselImages.length; j++) {
						if(iCountImages === settings.iNumberImages) {
							break;
						}
						var oImage = oCarouselImages[j];
						domStyle.set(oImage, sDimension, fSizeofImages + "%");
						domStyle.set(oImage, (settings.sPosition === 'horizontal') ? 'margin-left' : 'margin-top', fPaddingofImages + "%");
						if(domClass.contains(oImage, "video-element")){
							query(oImage).prepend("<div class='fake-video-element'></div>");
						}
						query("#" + sIdContent).append(oImage);
						iCountImages++;
						index++;
					}
					domStyle.set(sIdContent, sDimension, iMaxSize + "px");
				}

				var iSizeElement = 9999;
				query("#carousel-images-inner .carousel-images-content").forEach(function(node, index, nodeList) {
					query("#" + domAttr.get(node, "id") + " .carousel-element").forEach(function(node) {
						if(!domClass.contains(node, "video-element")) {
							if((settings.sPosition === "horizontal") ? domGeometry.getContentBox(node).h : domGeometry.getContentBox(node).w < iSizeElement) {
								iSizeElement = (settings.sPosition === "horizontal") ? domGeometry.getContentBox(node).h : domGeometry.getContentBox(node).w;
							}
						}
					});
					query("#" + domAttr.get(node, "id") + " .video-element").forEach(function(node) {
						domStyle.set(node, (settings.sPosition === "horizontal") ? "height" : "width", iSizeElement + "px");
					});
				});

				domClass.add(settings.sTarget, settings.sPosition);

				var iSizeInner = domGeometry.getContentBox("carousel-images-inner");
				var iSizeControl = domGeometry.getContentBox("leftControl");
				var iPositionControl = Math.ceil((iSizeInner.h - iSizeControl.h) / 2);
				if(settings.sPosition === 'vertical') {
					iPositionControl = Math.ceil((iSizeInner.w - iSizeControl.w) / 2);
				}
				domStyle.set("leftControl", (settings.sPosition === 'horizontal') ? "top" : "left", String(iPositionControl) + "px");
				domStyle.set("rightControl", (settings.sPosition === 'horizontal') ? "top" : "left", String(iPositionControl) + "px");
				showTargetImage(oFirstImage);

				manageControls(iCurrent);
				autoRotate(iCurrent);
				function manageControls(iPosition){
					if(iPosition === 0){
						domStyle.set("leftControl", "display", "none");
					} else {
						domStyle.set("leftControl", "display", "block");
					}
					if(iPosition === iNumberContents - 1){
						domStyle.set("rightControl", "display", "none");
					} else {
						domStyle.set("rightControl", "display", "block");
					}
				}

				function autoRotate(iPosition) {
					var iNextPosition = iPosition;
					oTimer = window.setTimeout(function(e) {
						if(iPosition == iNumberContents - 1) {
							iNextPosition = 0;
						}
						else {
							iNextPosition++;
						}
						manageControls(iNextPosition);
						animateRotate(iNextPosition);
						iCurrent = iNextPosition;
						window.clearTimeout(oTimer);
						autoRotate(iNextPosition);
					}, iTimer * 1000);
				}

				function centerImage(){
					if(settings.sPosition === 'vertical') {
						var oAux = query("#" + settings.sTarget + " > .target-content")[0];
						var oAux2 = document.getElementById(settings.sTarget).firstChild;
						var iTopImage = 0;
						iTopImage = Math.ceil((iMaxSize - parseInt(domGeometry.getContentBox(oAux).h, 10)) / 2);
						if(iTopImage > 0) {
							domStyle.set(oAux, "margin-top", iTopImage + "px");
						}
					}
				}

				function animateRotate(iAux) {
					if(settings.sPosition === 'horizontal') {
						query("#carousel-images-inner").animateProperty({
							duration: 500,
							properties: {
								marginLeft: {
									start: function(node) {
										return parseInt(domStyle.get(node, "margin-left"), 10);
									},
									end: function(node) {
										return parseInt(iMaxSize * (-iAux), 10);
									},
									units: "px"
								}
							}
						}).play();
					}
					else {
						query("#carousel-images-inner").animateProperty({
							duration: 500,
							properties: {
								marginTop: {
									start: function(node) {
										return parseInt(domStyle.get(node, "margin-top"), 10);
									},
									end: function(node) {
										return parseInt(iMaxSize * (-iAux), 10);
									},
									units: "px"
								}
							}
						}).play();
					}
				}

				function showTargetImage(oImage) {
					domAttr.remove(oImage, "style");
					query("#" + settings.sTarget).innerHTML("<div class='target-content'></div>");
					query("#" + settings.sTarget + " > .target-content").append(oImage);

					var sTitle = (domAttr.has(oImage, "data-title")) ? domAttr.get(oImage, "data-title") : "";
					var sDescription = (domAttr.has(oImage, "data-description")) ? domAttr.get(oImage, "data-description") : "";

					if(sTitle !== "" || sDescription !== "") {
						query("#" + settings.sTarget + " > .target-content").append("<div class='target-data'>" + ((sTitle !== "") ? "<h2>" + sTitle + "</h2>" : "") + ((sDescription !== "") ? "<p>" + sDescription + "</p>" : "") + "</div>");
					}

					centerImage();
					query("#" + settings.sTarget + " > .target-content").animateProperty({
						duration: 800,
						properties:{
							opacity: {start: 0, end: 1}
						}
					}).play();
				}

				query("#" + settings.sSource).on("mouseover", function(evt) {
					bHover = true;
					window.clearInterval(oTimer);
				});

				query("#" + settings.sSource).on("mouseout", function(evt) {
					bHover = false;
					autoRotate(iCurrent);
				});

				query(".control").on("click", function(e) {
					iCurrent = (domAttr.get(this, "id") == "rightControl") ? iCurrent + 1 : iCurrent - 1;
					manageControls(iCurrent);
					animateRotate(iCurrent);
					window.clearTimeout(oTimer);
					if(!bHover) {
						autoRotate(iCurrent);
					}
				});

				query("#carousel-images-inner .carousel-element").on("click", function(e) {
					var oNewImageTarget = this.cloneNode(true);
					query("#carousel-images-inner .current").forEach(function(node, index, nodeList) {
						domClass.remove(node, "current");
					});
					domClass.add(this, "current");					
					showTargetImage(oNewImageTarget);
				});
		});
	}
}
