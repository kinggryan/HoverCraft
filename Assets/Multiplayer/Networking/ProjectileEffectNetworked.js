#pragma strict

// Projectile Effect call via network class. Causes creation and destruction of projectile particle effects

public var explosionDelay : float;
public var explosionEffect : GameObject;

// Explode Remote is called in server, sends a signal to clients
function ExplodeRemote() {
	networkView.RPC("ExplodeVisual",RPCMode.Others);
}

@RPC
function ExplodeVisual() {
	GameObject.Destroy(GameObject.Instantiate(explosionEffect,transform.position,Quaternion.identity),1.5);
}