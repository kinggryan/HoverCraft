#pragma strict

public var baseColor : Color;

function OnMouseEnter() {
	var ccc : CreatorControl = GameObject.Find("MainCreatorControl").GetComponent("CreatorControl");
	renderer.material.color = ccc.highlightColor ;
	
	for(var tempRenderer : Renderer in GetComponentsInChildren(Renderer))
	{
		var tempConnect : Connector = GetComponent("Connector");
		if(ccc.actionMode == 2)
			tempConnect.DrawMotorArrow();
		else if(ccc.actionMode == 3)
			tempConnect.DrawRotationArrow();
			
		tempRenderer.material.color = ccc.highlightColor;
	}
}

function OnMouseExit() {
	renderer.material.color = baseColor;
	
	for(var tempRenderer : Renderer in GetComponentsInChildren(Renderer))
		tempRenderer.material.color = baseColor;
		
	var tempConnect : Connector = GetComponent(Connector);
	tempConnect.RemoveArrow();
}