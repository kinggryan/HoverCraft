#pragma strict

// This class manages how pieces deal and receive damage from other pieces. 

public var pieceMaxHealth : int;	//	 maximum health
public var dealtDamage : int;		// 	 damage dealt when this piece deals damage
public var associatedJoint : Joint;	//   joint that is weakend when this piece is damaged
public var associatedJointMaxBreakStrength : int;	// the break force of the associated joint at full health
public var collisionDamageInterval : float;			// amount of time between damage calls when the piece is in continuous contact. Set to -1 for one-time collision damage	
public var damageEnabled : boolean;				// whether the piece can deal damage now or not
public var currentHealth : int;					// the current health of the piece	

function Start () {
	currentHealth = pieceMaxHealth;
}

function CauseDamage (collidedObj : BattleManager)
{
	collidedObj.ReceiveDamage(dealtDamage);
}

function ReceiveDamage (damage : int)
{
	currentHealth -= damage;
	
	// weaken associated joint
	if(associatedJoint != null)
	{
		if(currentHealth <= 0)
			associatedJoint.breakForce = 0;
		else
			associatedJoint.breakForce = associatedJointMaxBreakStrength * currentHealth / pieceMaxHealth;
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
		}
	}
}

// Generalized joint break function. TODO add a function into connector that can be called here for specialized joint reactions.
function OnJointBreak()
{
	Debug.Log("joint broken from " + gameObject);
	Physics.IgnoreCollision(collider,associatedJoint.connectedBody.collider,false);
}

function EnableDisableInTime(time : int , on : boolean)
{
	yield WaitForSeconds(time);
	EnableDisableDamage(on);
}

function DeActivate()
{}