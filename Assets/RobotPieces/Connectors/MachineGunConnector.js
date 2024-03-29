﻿#pragma strict

public var rotationGrabberType : GameObject;
public var bulletEffect : ParticleSystem;
private var readyToFire : boolean = true;
public var bulletEffectObject : ParticleSystem;
private var battleManager : BattleManager;

public class MachineGunConnector extends Connector
{
	function Connect (blockObject : GameObject , attachPoint : Vector3, attachDirection : Vector3){
		var worldSpaceSide : Vector3 = blockObject.transform.TransformPoint(attachPoint*1.2);
		var worldSpaceDir : Vector3 = blockObject.transform.TransformDirection(attachDirection);
		
		transform.position = worldSpaceSide;
		transform.rotation = Quaternion.LookRotation(worldSpaceDir,Vector3(worldSpaceDir.y,worldSpaceDir.z,worldSpaceDir.x));
	//	transform.position += (transform.position - blockObject.transform.position);
		
		// attach to block
		var machinePieceInfo : MachinePieceAttachments = GetComponent("MachinePieceAttachments");
		for(var currObj : GameObject in machinePieceInfo.connectedObjects)
			currObj = blockObject;
		
	//	gameObject.AddComponent(KeyBindedActivator).key = "1";
		gameObject.AddComponent(TargettingActivator).key = "1";
		
		// prepare to fire
		readyToFire = true;
		bulletEffectObject = ParticleSystem.Instantiate(bulletEffect,transform.position,Quaternion.LookRotation(transform.up,transform.forward));
		bulletEffectObject.transform.parent = transform;
		bulletEffectObject.enableEmission = false;
		bulletEffectObject.simulationSpace = ParticleSystemSimulationSpace.World;
		
		// be parented by attached block
		transform.parent = blockObject.transform;
	}
	
	function Start()
	{
		motorDirection = -1;
		linkedPieces = new Array();
	
		bulletEffectObject = ParticleSystem.Instantiate(bulletEffect,transform.position,Quaternion.LookRotation(transform.up,transform.forward));
		bulletEffectObject.transform.parent = transform;
		bulletEffectObject.enableEmission = false;
		
		battleManager = GetComponent("BattleManager");
	}
	
	function rotatePieceGeneric()
	{
		// destroy other rotation grabbers and create a new rotation grabber for this object
		GameObject.Destroy(GameObject.Find("RotationGrabberObject"));
			
		var rGrabber : GameObject = Instantiate(rotationGrabberType,transform.TransformPoint(Vector3(0,4,0)),Quaternion.identity);
		var rGrabberData : RotationGrabber = rGrabber.GetComponent("RotationGrabber");
		rGrabberData.radius = 4;
		rGrabberData.anchorPoint = transform.position;
		//rGrabberData.rotationAxis = transform.TransformDirection(Vector3.forward);
		rGrabberData.rotationAxis = Vector3.forward;
		rGrabberData.grabbedObj = this;
		
		rGrabber = Instantiate(rotationGrabberType,transform.TransformPoint(Vector3(4,0,0)),Quaternion.identity);
		rGrabberData = rGrabber.GetComponent("RotationGrabber");
		rGrabberData.radius = 4;
		rGrabberData.anchorPoint = transform.position;
		//rGrabberData.rotationAxis = transform.TransformDirection(Vector3.right);
		rGrabberData.rotationAxis = Vector3.up;
		rGrabberData.grabbedObj = this; 
		
		DrawRotationArrow();
	}
	
	function rotate(angleToRotate: float, axis : Vector3)
	{	
		// rotate around the anchor point, currently set as object center
		var anchorPoint : Vector3 = Vector3.zero;
		transform.RotateAround(transform.TransformPoint(anchorPoint),axis,-angleToRotate);
		
		DrawRotationArrow();
	}
	
	function DrawRotationArrow()
	{
		DrawArrow(transform.position,4*transform.TransformDirection(Vector3.up),Color(1,1,1));
	}
	
	function ReadyFromFire()
	{
		readyToFire = true;
		bulletEffectObject.enableEmission = false;
	}
	
	function FixedActivate()
	{
		if(readyToFire && !battleManager.IsOverHeated())
		{
			var hitInfo : RaycastHit;
			// Generate the variation for the fire
			var fireChangeAmount = Random.Range(0,2);
			var fireChangeDirection = Random.Range(0,360);
			
			// Fire and check collisions
			if(Physics.Raycast(transform.position,transform.up,hitInfo));
			{
				Debug.Log("Gun hit : " + hitInfo.collider);
				// actually deal damage
				var tempBM : BattleManager = GetComponent("BattleManager");
				if(hitInfo.collider != null)
				{
					var otherBM : BattleManager = hitInfo.collider.GetComponent("BattleManager");
					if(otherBM != null)
						tempBM.CauseDamage(otherBM);
				}
			}
				
			bulletEffectObject.enableEmission = true;
				
			// add heat
			battleManager.AddHeat();
				
			// Delay until next firing
			readyToFire = false;
			Invoke("ReadyFromFire",.1);
		}
	}
}