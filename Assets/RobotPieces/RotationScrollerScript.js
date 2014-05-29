#pragma strict

public var relatedConnector : Connector;
private var xRotationAxisValue : float;
private var yRotationAxisValue : float;
private var zRotationAxisValue : float;
private var xTwist : float;
private var yTwist : float;
private var zTwist : float;

function OnGUI()
{
	var delta : float;
	var prevvalue : float;

	GUI.Label(Rect(425,25,100,30),"XRotation");
	prevvalue = xRotationAxisValue;
	xRotationAxisValue = GUI.HorizontalScrollbar (Rect (500	, 25, 100, 30), xRotationAxisValue, 1.0, 0.0, 10.0);
	delta = prevvalue - xRotationAxisValue;
	if(GUI.Button(Rect(625,13,30,25),"90"))
		delta = 90;
	if(GUI.Button(Rect(675,13,30,25),"180"))
		delta = 180;
	if(delta != 0 && relatedConnector)
		relatedConnector.rotate(delta*40,Vector3.right);
	
	GUI.Label(Rect(425,45,100,30),"YRotation");
	prevvalue = yRotationAxisValue;
	yRotationAxisValue = GUI.HorizontalScrollbar (Rect (500	, 45, 100, 30), yRotationAxisValue, 1.0, 0.0, 10.0);
	delta = prevvalue - yRotationAxisValue;
	if(GUI.Button(Rect(625,38,30,25),"90"))
		delta = 2;
	if(GUI.Button(Rect(675,38,30,25),"180"))
		delta = Mathf.PI/40;
	if(delta != 0 && relatedConnector)
		relatedConnector.rotate(delta*40,Vector3.up);
	
	GUI.Label(Rect(425,65,100,30),"ZRotation");
	prevvalue = zRotationAxisValue;
	zRotationAxisValue = GUI.HorizontalScrollbar (Rect (500	, 65, 100, 30), zRotationAxisValue, 1.0, 0.0, 10.0);
	delta = prevvalue - zRotationAxisValue;
	if(delta != 0 && relatedConnector)
		relatedConnector.rotate(delta*40,Vector3.forward);
}