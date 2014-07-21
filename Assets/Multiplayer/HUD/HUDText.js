#pragma strict

/*****

	HUD Text Component
	
	Displays text for a while on the Camera.
	
******/

public var lifespan : float;
public var text : String;

function Start() {
	yield WaitForSeconds(lifespan);
	DestroySelf();
}

function DestroySelf() {
	gameObject.Destroy(this);
}

function OnGUI() {
		GUI.Label(Rect(Screen.width/2 - 100,Screen.height/2,200,25),text);
}