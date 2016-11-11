// See [https://github.com/invokeImmediately/distinguishedscholarships.wsu.edu] for repository of source code
/************************************************************************************************************
 * CUSTOM JQUERY-BASED DYNAMIC CONTENT                                                                      *
 ************************************************************************************************************/
(function ($) {
	$(document).ready(function () {
		/**********************************************************************************************
		 * Tweak HTML source to work around some quirks of WordPress setup                            *
		 **********************************************************************************************/
		var siteURL = window.location.pathname;
		switch (siteURL) {
			/* case '/':
			$('#menu-item-35').remove();
			$('#spine-sitenav ul li').first().css('border-top', 'none');
			$('#spine-sitenav').addClass('homeless');
			break;*/
		case '/news/':
			$('div.column.one').first().parent('section').before('<section class="row single gutter pad-top"><div class="column one"><section class="article-header header-newsEvents"><div class="header-content"><h2>News</h2><h3>What We and Our Students Have Accomplished</h3></div></section></div></section>');
			break;
		}
		
		initNiloaPortal(".niloa-portal");
	});
	
	function HexagonalButton($fromElem) {
		var validArg = isJQuery($fromElem);
		var tan30 = Math.tan(30 / 180 * Math.PI);
		this.origin = {
			x: validArg ? $fromElem.offset().left : undefined,
			y: validArg ? $fromElem.offset().top : undefined
		};
		this.apotherm = $fromElem.width() / 2;
		this.vertices = [
			{
				x: (validArg)
					? this.origin.x + this.apotherm
					: undefined,
				y: (validArg)
					? this.origin.y
					: undefined
			},
			{
				x: (validArg)
					? this.origin.x + this.apotherm * 2
					: undefined,
				y: (validArg)
					? this.origin.y + tan30 * this.apotherm
					: undefined
			},
			{
				x: (validArg)
					? this.origin.x + this.apotherm * 2
					: undefined,
				y: (validArg)
					? this.origin.y + 3 * tan30 * this.apotherm
					: undefined
			},
			{
				x: (validArg) ?
					this.origin.x + this.apotherm
					: undefined,
				y: (validArg)
					? this.origin.y + 4 * tan30 * this.apotherm
					: undefined
			},
			{
				x: (validArg)
					? this.origin.x
					: undefined,
				y: (validArg)
					? this.origin.y + 3 * tan30 * this.apotherm
					: undefined
			},
			{
				x: (validArg)
					? this.origin.x
					: undefined,
				y: (validArg)
					? this.origin.y + tan30 * this.apotherm
					: undefined
			}
		];
		this.keySegments = [
			{
				slope: (validArg)
					? -tan30
					: undefined,
				intercept: (validArg)
					? this.vertices[5].y - (-tan30 * this.vertices[5].x)
					: undefined
			},
			{
				slope: (validArg)
					? tan30
					: undefined,
				intercept: (validArg)
					? this.vertices[4].y - tan30 * this.vertices[4].x
					: undefined
			},
			{
				slope: (validArg)
					? tan30
					: undefined,
				intercept: (validArg)
					? this.vertices[0].y - tan30 * this.vertices[0].x
					: undefined
			},
			{
				slope: (validArg)
					? -tan30
					: undefined,
				intercept: (validArg)
					? this.vertices[3].y - (-tan30 * this.vertices[3].x)
					: undefined
			}
		];
	}

	HexagonalButton.prototype.getSegmentY = function(whichSgmnt, pageX) {
		var pageY = undefined;
		if (whichSgmnt >= 0 && whichSgmnt <=3) {
			pageY = this.keySegments[whichSgmnt].slope * pageX + this.keySegments[whichSgmnt].intercept;
		}
		return pageY;
	}
	
	HexagonalButton.prototype.isWithinArea = function(pageX, pageY) {
		var result = false;
		if (pageX >= this.vertices[5].x && pageX <= this.vertices[1].x) {
			if (pageX <= this.vertices[0].x) {
				var sgmnt0Y = this.getSegmentY(0, pageX);
				var sgmnt1Y = this.getSegmentY(1, pageX);
				result = pageY >= sgmnt0Y && pageY <= sgmnt1Y;
			}
			else {
				var sgmnt2Y = this.getSegmentY(2, pageX);
				var sgmnt3Y = this.getSegmentY(3, pageX);
				result = pageY >= sgmnt2Y && pageY <= sgmnt3Y;
			}
		}
		return result;
	}
	
	function handleNiloaClick($whichBttn, bttnCoords, clickEvent) {
		if (isJQuery($whichBttn) && bttnCoords && bttnCoords instanceof HexagonalButton) {
			if (bttnCoords.isWithinArea(clickEvent.pageX, clickEvent.pageY)) {
				var bttnHref = $whichBttn.data("href");
				if (bttnHref) {
					// TODO: add Regular Expressions check on href formatting.
					window.location.href = bttnHref;
				}
			}
		}
	}

	function handleNiloaLeave($whichBttn) {
		if (isJQuery($whichBttn)) {
			$whichBttn.removeClass("hovered");
		}
	}
	
	function handleNiloaMouseMove($whichBttn, bttnCoords, moveEvent) {
		var destHref = "";
		if (isJQuery($whichBttn) && bttnCoords && bttnCoords instanceof HexagonalButton) {
			if (bttnCoords.isWithinArea(moveEvent.pageX, moveEvent.pageY)) {
				destHref = $whichBttn.data("href");
				$whichBttn.addClass("hovered");
			}
			else {
				$whichBttn.removeClass("hovered");
			}
		}
		return destHref;
	}
	
	function initNiloaPortal(slctrPortal) {
		var $portal = $(slctrPortal);
		if ($portal.length == 1) {
			/** TODO: Use jQuery.data(…, …) to store coordinates with elements; this will minimize unnecessary
			 *  repeated calculations. Note that the addition of a $(window).resize(…) will be necessary to
			 *  recalculate coordinates if the user changes the size of the browser window. */
			var $bttnsToCheck = $portal.find("li.panel");
			$bttnsToCheck.each(function () {
				var $thisBttn = $(this);
				var bttnHref = $thisBttn.data("href");
				if (!bttnHref) {
					var $childLink = $thisBttn.find("a");
					if ($childLink.length == 1) {
						bttnHref = $childLink.attr("href");
						$thisBttn.data("href", bttnHref);
					}
				}
			});			
			$portal.mousemove(function(moveEvent) {
				var bttnHref = "";
				var destHref = "";
				var $bttns = $portal.find("li.panel");
				$bttns.each(function () {
					var $thisBttn = $(this);
					var hxgnlBttn = new HexagonalButton($(this));
					destHref = handleNiloaMouseMove($thisBttn, hxgnlBttn, moveEvent);
					if (destHref != "") {
						bttnHref = destHref;
					}
				});
				var $statusBar = $("div.simulated-status-bar");
				if ($statusBar.length == 1) {
					if (bttnHref) {
						$statusBar.text(bttnHref);
						$statusBar.stop().fadeIn(200);
					}
					else {
						$statusBar.stop().fadeOut(200);
					}
				}				
			}).click(function(clickEvent) {
				var $bttns = $portal.find("li.panel");
				$bttns.each(function () {
					var $thisBttn = $(this);
					var hxgnlBttn = new HexagonalButton($(this));
					handleNiloaClick($thisBttn, hxgnlBttn, clickEvent);
				});
			}).mouseleave(function() {
				var $bttns = $portal.find("li.panel");
				$bttns.each(function () {
					var $thisBttn = $(this);
					handleNiloaLeave($thisBttn);
				});
				var $statusBar = $("div.simulated-status-bar");
				if ($statusBar.length == 1) {
					$statusBar.stop().fadeOut(200);
				}
			});
		}
	}
})(jQuery);
