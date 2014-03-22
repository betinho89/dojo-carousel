function Carousel() {
	return this;
}
Carousel.prototype = {
	// Default options
	sTarget: "",
	sSource: "",
	sPosition: "horizontal",
	bSameWidth: false,
	iMaxHeight: 500,
	iDuration: 5,
	iNumberImages: 3,
	bContinue: false,
	bShowInfo: false,
	// Globals vars
	oTimer: null,
	iTimer: 0,
	iCurrent: 0,
	iMaxSize: 0,
	sDimension: "",
	oCarouselImages: null,
	bHover: false,
	iNumberContents: 0,
	sLeftControlId: "",
	sRightControlId: "",
	setSettings: function(userSettings) {
		if(userSettings.sSource === undefined || userSettings.sTarget === undefined) {
			console.error("Error: El source y el target deben de estar definidos.");
			this.bContinue = false;
		}
		else {
			this.sSource = userSettings.sSource;
			this.sTarget = userSettings.sTarget;
			if(userSettings.sPosition !== undefined) { this.sPosition = userSettings.sPosition; }
			if(userSettings.bSameWidth !== undefined) { this.bSameWidth = userSettings.bSameWidth; }
			if(userSettings.iMaxHeight !== undefined) { this.iMaxHeight = userSettings.iMaxHeight; }
			if(userSettings.iDuration !== undefined) { this.iDuration = userSettings.iDuration; }
			if(userSettings.iNumberImages !== undefined) { this.iNumberImages = userSettings.iNumberImages; }
			if(userSettings.bShowInfo !== undefined) { this.bShowInfo = userSettings.bShowInfo; }
			this.bContinue = true;
		}
	},
	initCarousel: function() {
		if(this.bContinue) {
			var oCarousel = this;
			require(["dojo/dom", "dojo/dom-attr", "dojo/dom-class", "dojo/query", "dojo/dom-geometry", "dojo/dom-style", "dojo/NodeList-manipulate"],
				function(dom, domAttr, domClass, query, domGeometry, domStyle) {
					oCarousel.iTimer = ((oCarousel.iDuration !== null && oCarousel.iDuration > 0) ? oCarousel.iDuration : 5);
					oCarousel.iCurrent = 0;
					oCarousel.iMaxSize = domGeometry.getContentBox(oCarousel.sSource).w;
					oCarousel.sDimension = (oCarousel.sPosition === 'horizontal') ? "width" : "height";
					oCarousel.oCarouselImages = query("#" + oCarousel.sSource + " .carousel-element");
					oCarousel.bHover = false;

					if(oCarousel.sPosition === 'vertical') {
						if(oCarousel.bSameWidth === false) {
							oCarousel.iMaxSize = oCarousel.iMaxHeight;
						}
						domStyle.set(oCarousel.sSource, "height", oCarousel.iMaxSize + "px");
					}

					var fSizeofImages = (90 / oCarousel.iNumberImages).toFixed(5);
					var fPaddingofImages = (9 / oCarousel.iNumberImages).toFixed(5);

					query("#" + oCarousel.sSource).append("<div class='carousel-images-inner'></div>");
					domClass.add(oCarousel.sSource, oCarousel.sPosition);
					domClass.add(oCarousel.sTarget, oCarousel.sPosition);

					oCarousel.iNumberContents = Math.ceil(oCarousel.oCarouselImages.length / oCarousel.iNumberImages);
					domStyle.set(query("#" + oCarousel.sSource + " > .carousel-images-inner")[0], oCarousel.sDimension, (oCarousel.iMaxSize * oCarousel.iNumberContents) + "px");

					oCarousel.sLeftControlId = oCarousel.sSource + "-lf";
					oCarousel.sRightControlId = oCarousel.sSource + "-rf";
					query("#" + oCarousel.sSource).prepend("<span class='control left-control " + oCarousel.sPosition + "' id='" + oCarousel.sLeftControlId + "'></span>");
					query("#" + oCarousel.sSource).append("<span class='control right-control " + oCarousel.sPosition + "' id='" + oCarousel.sRightControlId + "'></span>");

					var index = 0;
					var iCountImages = 0;
					var sIdContent = "";
					var oFirstImage = null;
					if(oCarousel.oCarouselImages.length > 0) {
						oFirstImage = oCarousel.oCarouselImages[0].cloneNode(true);
						domClass.add(oCarousel.oCarouselImages[0], "current");
					}
					for (var i = 0; i < oCarousel.iNumberContents; i++) {
						sIdContent = oCarousel.sSource +"-content-" + String(i);
						iCountImages = 0;
						query("#" + oCarousel.sSource + " > .carousel-images-inner").append("<div id='" + sIdContent + "' class='carousel-images-content'></div>");
						for (var j = index; j < oCarousel.oCarouselImages.length; j++) {
							if(iCountImages === oCarousel.iNumberImages) {
								break;
							}
							var oImage = oCarousel.oCarouselImages[j];
							domStyle.set(oImage, oCarousel.sDimension, fSizeofImages + "%");
							domStyle.set(oImage, (oCarousel.sPosition === 'horizontal') ? 'margin-left' : 'margin-top', fPaddingofImages + "%");
							if(domClass.contains(oImage, "video-element")){
								query(oImage).prepend("<div class='fake-video-element'></div>");
							}
							query("#" + sIdContent).append(oImage);
							if(oCarousel.sPosition === "vertical") {
								query("#" + sIdContent).append("<br/>");
							}
							iCountImages++;
							index++;
						}
						domStyle.set(sIdContent, oCarousel.sDimension, oCarousel.iMaxSize + "px");
					}

					var iSizeElement = 9999;
					query("#" + oCarousel.sSource + " > .carousel-images-inner .carousel-images-content").forEach(function(node, index, nodeList) {
						query("#" + domAttr.get(node, "id") + " .carousel-element").forEach(function(node) {
							if(!domClass.contains(node, "video-element")) {
								if((oCarousel.sPosition === "horizontal") ? domGeometry.getContentBox(node).h : domGeometry.getContentBox(node).w < iSizeElement) {
									iSizeElement = (oCarousel.sPosition === "horizontal") ? domGeometry.getContentBox(node).h : domGeometry.getContentBox(node).w;
								}
							}
						});
						query("#" + domAttr.get(node, "id") + " .video-element").forEach(function(node) {
							domStyle.set(node, (oCarousel.sPosition === "horizontal") ? "height" : "width", iSizeElement + "px");
						});
					});

					oCarousel.showTargetImage(oFirstImage, oCarousel);

					var iSizeInner = domGeometry.getContentBox(oCarousel.sSource);
					var iSizeControl = domGeometry.getContentBox(oCarousel.sLeftControlId);

					var iPositionControl = Math.ceil((iSizeInner.h - iSizeControl.h) / 2);
					if(oCarousel.sPosition === 'vertical') {
						iPositionControl = Math.ceil((iSizeInner.w - iSizeControl.w) / 2);
					}
					domStyle.set(oCarousel.sLeftControlId, (oCarousel.sPosition === 'horizontal') ? "top" : "left", String(iPositionControl) + "px");
					domStyle.set(oCarousel.sRightControlId, (oCarousel.sPosition === 'horizontal') ? "top" : "left", String(iPositionControl) + "px");

					oCarousel.manageControls(oCarousel.iCurrent, oCarousel);
					oCarousel.autoRotate(oCarousel.iCurrent, oCarousel);

					query("#" + oCarousel.sSource).on("mouseover", function(evt) {
						oCarousel.bHover = true;
						window.clearInterval(oCarousel.oTimer);
					});

					query("#" + oCarousel.sSource).on("mouseout", function(evt) {
						oCarousel.bHover = false;
						oCarousel.autoRotate(oCarousel.iCurrent, oCarousel);
					});

					query("#" + oCarousel.sSource + " .control").on("click", function(e) {
						oCarousel.iCurrent = (domAttr.get(this, "id") == oCarousel.sRightControlId) ? oCarousel.iCurrent + 1 : oCarousel.iCurrent - 1;
						oCarousel.manageControls(oCarousel.iCurrent, oCarousel);
						oCarousel.animateRotate(oCarousel.iCurrent, oCarousel);
						window.clearTimeout(oCarousel.oTimer);
						if(!oCarousel.bHover) {
							oCarousel.autoRotate(oCarousel.iCurrent, oCarousel);
						}
					});

					query("#" + oCarousel.sSource + " > .carousel-images-inner .carousel-element").on("click", function(e) {
						query("#" + oCarousel.sSource + " > .carousel-images-inner .current").forEach(function(node, index, nodeList) {
							domClass.remove(node, "current");
						});
						domClass.add(this, "current");

						var oNewImageTarget = this.cloneNode(true);
						oCarousel.showTargetImage(oNewImageTarget, oCarousel);
					});
				}
			);
		}
	},
	manageControls: function(iPosition, oCarousel) {
		require(["dojo/dom-style"], function(domStyle) {
			if(iPosition === 0){
				domStyle.set(oCarousel.sLeftControlId, "display", "none");
			} else {
				domStyle.set(oCarousel.sLeftControlId, "display", "block");
			}
			if(iPosition === oCarousel.iNumberContents - 1){
				domStyle.set(oCarousel.sRightControlId, "display", "none");
			} else {
				domStyle.set(oCarousel.sRightControlId, "display", "block");
			}
		});
	},
	autoRotate: function(iPosition, oCarousel) {
		var iNextPosition = iPosition;
		oCarousel.oTimer = window.setTimeout(function(e) {
			if(iPosition === (oCarousel.iNumberContents - 1)) {
				iNextPosition = 0;
			}
			else {
				iNextPosition++;
			}
			oCarousel.manageControls(iNextPosition, oCarousel);
			oCarousel.animateRotate(iNextPosition, oCarousel);
			oCarousel.iCurrent = iNextPosition;
			window.clearTimeout(oCarousel.oTimer);
			oCarousel.autoRotate(iNextPosition, oCarousel);
		}, oCarousel.iTimer * 1000);
	},
	animateRotate: function(iPosition, oCarousel) {
		require(["dojo/query", "dojo/dom-style", "dojo/NodeList-manipulate"],
				function(query, domStyle) {
					if(oCarousel.sPosition === 'horizontal') {
						query("#" + oCarousel.sSource + " > .carousel-images-inner").animateProperty({
							duration: 500,
							properties: {
								marginLeft: {
									start: function(node) {
										return parseInt(domStyle.get(node, "margin-left"), 10);
									},
									end: function(node) {
										return parseInt(oCarousel.iMaxSize * (-iPosition), 10);
									},
									units: "px"
								}
							}
						}).play();
					}
					else {
						query("#" + oCarousel.sSource + " > .carousel-images-inner").animateProperty({
							duration: 500,
							properties: {
								marginTop: {
									start: function(node) {
										return parseInt(domStyle.get(node, "margin-top"), 10);
									},
									end: function(node) {
										return parseInt(oCarousel.iMaxSize * (-iPosition), 10);
									},
									units: "px"
								}
							}
						}).play();
					}
				}
			);
	},
	centerImage: function(oCarousel) {
		require(["dojo/query", "dojo/dom-geometry", "dojo/dom-style", "dojo/NodeList-manipulate"],
			function(query, domGeometry, domStyle) {
				if(oCarousel.sPosition === 'vertical') {
					var oAux = query("#" + oCarousel.sTarget + " > .target-content")[0];
					var iTopImage = 0;
					setTimeout(function() {
						console.log(domGeometry.getContentBox(oAux));
						iTopImage = Math.ceil((oCarousel.iMaxSize - parseInt(domGeometry.getContentBox(oAux).h, 10)) / 2);
						if(iTopImage > 0) {
							domStyle.set(oAux, "margin-top", iTopImage + "px");
						}
					}, 200);
				}
			}
		);
	},
	showTargetImage: function(oImage, oCarousel) {
		require(["dojo/dom-attr", "dojo/query", "dojo/NodeList-manipulate", "dojo/_base/fx", "dojo/NodeList-fx"],
			function(domAttr, query,  fx) {
				domAttr.set(oImage, "style", "");
				query("#" + oCarousel.sTarget).innerHTML("<div class='target-content'></div>");
				query("#" + oCarousel.sTarget + " > .target-content").append(oImage);

				if(oCarousel.bShowInfo) {
					var sTitle = (domAttr.has(oImage, "data-title")) ? domAttr.get(oImage, "data-title") : "";
					var sDescription = (domAttr.has(oImage, "data-description")) ? domAttr.get(oImage, "data-description") : "";

					if(sTitle !== "" || sDescription !== "") {
						query("#" + oCarousel.sTarget + " > .target-content").append("<div class='target-data'>" + ((sTitle !== "") ? "<h2>" + sTitle + "</h2>" : "") + ((sDescription !== "") ? "<p>" + sDescription + "</p>" : "") + "</div>");
					}
				}

				oCarousel.centerImage(oCarousel);
				query("#" + oCarousel.sTarget + " > .target-content").animateProperty({
					duration: 800,
					properties:{
						opacity: {start: 0, end: 1}
					}
				}).play();
			}
		);
	}
};
