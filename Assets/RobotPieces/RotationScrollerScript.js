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
	if(delta != 0 && relatedConnector)
		relatedConnector.rotate(delta*40,relatedConnector.transform.right);
	
	GUI.Label(Rect(425,45,100,30),"YRotation");
	prevvalue = yRotationAxisValue;
	yRotationAxisValue = GUI.HorizontalScrollbar (Rect (500	, 45, 100, 30), yRotationAxisValue, 1.0, 0.0, 10.0);
	delta = prevvalue - yRotationAxisValue;
	if(delta != 0 && relatedConnector)
		relatedConnector.rotate(delta*40,relatedConnector.transform.up);
	
	GUI.Label(Rect(425,65,100,30),"ZRotation");
	prevvalue = zRotationAxisValue;
	zRotationAxisValue = GUI.HorizontalScrollbar (Rect (500	, 65, 100, 30), zRotationAxisValue, 1.0, 0.0, 10.0);
	delta = prevvalue - zRotationAxisValue;
	if(delta != 0 && relatedConnector)
		relatedConnector.rotate(delta*40,relatedConnector.transform.forward);
	
	GUI.Label(Rect(425,85,100,30),"XTwist");
	xTwist = GUI.HorizontalScrollbar (Rect (500	, 85, 100, 30), xTwist, 1.0, 0.0, 10.0);
	
	GUI.Label(Rect(425,105,100,30),"YTwist");
	yTwist = GUI.HorizontalScrollbar (Rect (500	, 105, 100, 30), yTwist, 1.0, 0.0, 10.0);
	
	GUI.Label(Rect(425,125,100,30),"ZTwist");
	zTwist = GUI.HorizontalScrollbar (Rect (500	, 125, 100, 30), zTwist, 1.0, 0.0, 10.0); 

		
}