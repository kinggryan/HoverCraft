#pragma strict

/**************

  HUD Manager class
  
  ///////////////////////
  
  Contains a set of static functions that can be called to display text and other info to the screen.
  
  *************/
  
static function ShowText(text : String) {
	var mainCam = GameObject.Find("Main Camera");
	var textComp = mainCam.AddComponent(HUDText);
	textComp.lifespan = 3.5;
	textComp.text = text;
}

static function ShowTextForTime(text : String, time : float) {
	var mainCam = GameObject.Find("Main Camera");
	var textComp = mainCam.AddComponent(HUDText);
	textComp.lifespan = time;
	textComp.text = text;
}	