#pragma strict

function OnMouseDown() {
	var ccc : CreatorControl = GameObject.Find("MainCreatorControl").GetComponent("CreatorControl");
	ccc.actionMode = 5;
	ccc.highlightColor = Color(1,.5,1);
}