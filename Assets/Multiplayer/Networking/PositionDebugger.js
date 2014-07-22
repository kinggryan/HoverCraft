#pragma strict

// For debug, spits out position every step
function Start () {
	if(Network.isServer)
		Debug.LogError(gameObject + " at "+transform.position);
}