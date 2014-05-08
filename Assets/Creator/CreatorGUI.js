﻿#pragma strict

// GUI for the design creator

public var control : CreatorControl;
public var pieces : GameObject[];
public var LARGE_GUI_BUTTON_SIZE : Vector2 = Vector2(75,100);
public var SMALL_GUI_BUTTON_SIZE : Vector2 = Vector2(75,50);
public var GUI_BUTTON_OFFSET : int = 25;
private var saveFileName : String = "MyDesign";

function Start() {
	if(!Directory.Exists("MachineDesigns"))
		Directory.CreateDirectory("MachineDesigns");
}

function OnGUI() {
	saveFileName = GUI.TextField(Rect(25,85,150,25),saveFileName,25);
	if(GUI.Button(Rect(25,25,150,50),"Save Design")) {
		MachineDesignManager.SaveMachineDesign(saveFileName);
	}
	
	var yPlacement = 120;
	for(piece in pieces) {
		if(GUI.Button(Rect(25,yPlacement,150,25),"Add "+FixName(piece.ToString()))) {
			control.machinePieceToCreate = piece;
			control.actionMode = 0;
			control.highlightColor = Color(.5,.5,1);
			for(var currRotate in GameObject.FindObjectsOfType(RotationGrabber))
				GameObject.Destroy(currRotate.gameObject);
		}
		
		yPlacement += 35;
	}
	
	if(GUI.Button(Rect(25,yPlacement,150,50),"Rotate Piece")) {
		control.actionMode = 3;
		control.highlightColor = Color(.5,1,.5);
	}
	
	yPlacement += 60;
	
	if(GUI.Button(Rect(25,yPlacement,150,50),"Test Design")) {
		Physics.gravity = Vector3(0,-9.8,0);
		Debug.Log("Gravity on");

		var getController : CreatorControl = GameObject.Find("MainCreatorControl").GetComponent("CreatorControl");
		getController.actionMode = 1;
		
		for(var currRotate in GameObject.FindObjectsOfType(RotationGrabber))
			GameObject.Destroy(currRotate.gameObject);
	
		// activate rotation and collision for all pieces
		for(var currObject in GameObject.FindGameObjectsWithTag("piece"))
		{
			if(currObject.rigidbody != null)
			{
				currObject.GetComponent(Rigidbody).freezeRotation = false;
				currObject.GetComponent(Rigidbody).detectCollisions = true;
			}
			else
				Debug.Log("No rigidbody on object " + currObject);
		}
	
		getController.SwitchToPlayMode();
	}
	
	yPlacement += 60;
}

function FixName(string : String) {
	var charArray : String = "(";
	return string.Substring(0, string.IndexOfAny(charArray.ToCharArray()));
}