#pragma strict

function OnMouseEnter() {
	renderer.material.color = Color(.5,.5,1);
}

function OnMouseExit() {
	renderer.material.color = Color(1,1,1);
}