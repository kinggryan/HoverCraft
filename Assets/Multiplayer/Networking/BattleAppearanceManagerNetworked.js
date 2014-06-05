#pragma strict

// Battle Appearance Manager class for Networked Play. Controls results of damage and heat on appearance of a piece. Can be
//		subclassed for individual piece effects.

public var heat		: float = 0;
public var maxHeat	: int;
public var cooldownRate : int;
public var overheatRate : int;

public var health 	: int = 0;
public var pieceMaxHealth : int;

function Start() {
	if(Network.isServer) {
		var BM : BattleManager = GetComponent(BattleManager);
		networkView.RPC("SetStartData",RPCMode.Others,BM.maximumFireHeat,BM.cooldownRate,BM.pieceMaxHealth,BM.overheatRate);
	}
}

@RPC
function SetStartData(mH : int, cR : int, mHealth : int, oHR : int) {
	maxHeat = mH;
	cooldownRate = cR;
	mHealth = 0;
	overheatRate = oHR;
}

function Update() {
	if(Network.isClient) {
		if(heat > 0) {
			heat -= cooldownRate * Time.deltaTime;
		}
		else
			heat = 0;
		
		renderer.material.color = Color(1.0,(1.0*maxHeat - heat)/(1.0*maxHeat),(1.0*maxHeat - heat)/(1.0*maxHeat),1);
	}
}

// call on the server to add heat to others
function AddHeatServer() {
	networkView.RPC("AddHeatNetwork",RPCMode.Others);
}

@RPC
function AddHeatNetwork() {
	heat += overheatRate;
}

// not needed for now, until graphical representation of health is implemented
@RPC
function ReceiveDamage(damage : int) {
	health -= damage;
	
	// TODO display health in some way
}