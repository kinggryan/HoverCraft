#pragma strict

// This class manages how pieces deal and receive damage from other pieces. 

public var pieceMaxHealth : int;	//	 maximum health
public var dealtDamage : int;		// 	 damage dealt when this piece deals damage
public var associatedJoint : Joint;	//   joint that is weakend when this piece is damaged
public var associatedJointMaxBreakStrength : int;	// the break force of the associated joint at full health
public var collisionDamageInterval : float;			// amount of time between damage calls when the piece is in continuous contact. Set to -1 for one-time collision damage	
public var damageEnabled : boolean;				// whether the piece can deal damage now or not
public var currentHealth : int;					// the current health of the piece	

// variables for dealing with overheating 5-23-14
public var overheatRate : int;					// amount the heat increases when fired
public var cooldownRate : int;					// the amount of heat the weapon loses per second. Keep in mind, overheat rate must be greater than this.
public var maximumFireHeat : int;				// when heat reaches this value, the weapon is no longer fireable
public var cooledHeat : int;					// if the weapon is overheated and reaches this heat value, it is no longer overheated and can be fired again.
public var heat : float = 0;							// how hot the weapon currently is
public var overHeated : boolean = false;				// if the weapon is currently overheated

public var contactEffect : GameObject = null;

public var BAM : BattleAppearanceManagerNetworked;

// Joint Break Simulator
public var 	jointBreakStrength : float = 100000;
public var  effectiveMass : float = 3.0;
private var lastStepVelocity : Vector3;
private var lastStepPosition : Vector3;

public var  XAimLimits : float = 45.0;
public var  YAimLimits : float = 45.0;
public var  aimDegreesPerSecond : float = 90;

function Start () {
	currentHealth = pieceMaxHealth;
	BAM = GetComponent(BattleAppearanceManagerNetworked);
	lastStepVelocity = Vector3.zero;
	lastStepPosition = transform.position;
	
	if(transform.parent != null) 
		transform.parent.rigidbody.mass += effectiveMass;
}

function CauseDamage (collidedObj : BattleManager)
{
	collidedObj.ReceiveDamage(dealtDamage);
}

function ReceiveDamage (damage : int)
{
	currentHealth -= damage;
	//renderer.material.color = Color(1,1.0*currentHealth/pieceMaxHealth,1.0*currentHealth/pieceMaxHealth,1);
	
	// weaken associated joint
	if(associatedJoint != null)
	{
		if(currentHealth <= 0)
			associatedJoint.breakForce = 0;
		else
			associatedJoint.breakForce = associatedJointMaxBreakStrength * currentHealth / pieceMaxHealth;
	}
	
	if(gameObject.GetComponent(MachineRepairer) != null) {
		gameObject.Destroy(gameObject.GetComponent(MachineRepairer));
	}
	
	// Send message to held flag that we received damage.
	var flag : HoldingFlag = GetComponent(HoldingFlag);
	if(flag == null)
		flag = GetComponentInParent(HoldingFlag);
		
	if(flag != null) {
		flag.ReceiveDamage(damage);
	}
}

function EnableDisableDamage(on : boolean)
{
	damageEnabled = on;
}

function OnCollisionStay(collision : Collision)
{
	var otherBM : BattleManager = collision.collider.GetComponent(BattleManager);
	if (damageEnabled && otherBM != null)
	{
		CauseDamage(otherBM);
		if(collisionDamageInterval > 0)
		{
			damageEnabled = false;
			EnableDisableInTime(collisionDamageInterval,true);
			if(contactEffect != null)
				GameObject.Destroy(GameObject.Instantiate(contactEffect,transform.position,Quaternion.identity),1.5);
		}
	}
}

// Generalized joint break function. TODO add a function into connector that can be called here for specialized joint reactions.
function OnJointBreak()
{
	Debug.Log("joint broken from " + gameObject);
	Physics.IgnoreCollision(collider,associatedJoint.connectedBody.collider,false);
	Destroy(GetComponent("KeyBindedActivator"));
}

function EnableDisableInTime(time : int , on : boolean)
{
	yield WaitForSeconds(time);
	EnableDisableDamage(on);
}

function DeActivate()
{}

function IsOverHeated()
{
	return overHeated;
}

function AddHeat() {
	heat += overheatRate;
	if(Network.isServer)
		BAM.AddHeatServer();
}

function Update() {
	if(heat > 0) {
		if(heat > maximumFireHeat)
			overHeated = true;
		if(overHeated && heat <= cooledHeat)
			overHeated = false;
		heat -= cooldownRate * Time.deltaTime;
	}
	else
		heat = 0;
		
	renderer.material.color = Color(1.0,(1.0*maximumFireHeat - heat)/(1.0*maximumFireHeat),(1.0*maximumFireHeat - heat)/(1.0*maximumFireHeat),1);
}

function FixedUpdate() {
	if(transform.parent != null) {
		var thisStepVelocity = transform.position - lastStepPosition;
		var velocityChange = thisStepVelocity - lastStepVelocity;
		var acceleration = velocityChange / Time.deltaTime;
	
		lastStepVelocity = thisStepVelocity;
		lastStepPosition = transform.position;
	
		var forceApplied = (effectiveMass * acceleration).magnitude;
	
		if (forceApplied > jointBreakStrength) {
			// break joint by unparenting and setting rigidbody to be non kinematic
			transform.parent.rigidbody.mass -= effectiveMass;
			transform.parent = null;
			var rigid : Rigidbody = gameObject.AddComponent(Rigidbody);
			rigid.mass = effectiveMass;
			gameObject.Destroy(this);
		}
	}
}

function GetVelocity() {
	return lastStepVelocity;
}