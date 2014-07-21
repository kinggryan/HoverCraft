#pragma strict

import System.Text;
import System.IO;
import System.Runtime.Serialization.Formatters.Binary;
 
import System;
import System.Runtime.Serialization;
import System.Reflection;

// Stores data for save and load piece tree
class PieceTreeNode extends UnityEngine.Object implements ISerializable{
	public var children : Array;
	public var pieceType : int;
	public var position : Vector3;
	public var rotation : Quaternion;
	public var activator : int;
	public var activatorKey : char;
	public var pieceID : int;
	public var nodeID : int;
	static public var nodeCount : int;

	function PieceTreeNode()
	{
		nodeID = nodeCount;
		nodeCount++;
		children = new Array();
	}
	
	// construct with a particular id. Used during loading - thus, we don't need to increment nodecount
	function PieceTreeNode(id : int){
		nodeID = id;
		children = new Array();
	}
	
	function PieceTreeNode(info : SerializationInfo, ctxt : StreamingContext) {
		// we'll do nothing here. Deserialize using custom functions
//		info.GetValue("pieceType_"+id, pieceType);
//		info.AddValue("position_"+id, position);
//		info.AddValue("rotation_"+id, rotation);
//		info.GetValue("activator_"+id, activator);
//		info.GetValue("activatorKey_"+id, activatorKey);
//		info.GetValue("childCount_"+id, children.length);
//		pieceType = 500;
	}

	function SetData(newPieceType : int, newPosition : Vector3, newRotation :Quaternion, newActivator : int, newActivatorKey : char)
	{
		pieceType = newPieceType;
		position = newPosition;
		rotation = newRotation;
		activator = newActivator;
		activatorKey = newActivatorKey;
		
	//	Debug.Log("Node data (node : "+nodeID+"). Position : "+newPo
	}

	function AddChild(child : PieceTreeNode)
	{
		children.push(child);
	}

	function GetChild(index : int)
	{
		if(index >= children.length)
			return null;
		else
			return children[index];
	}
	
	// called when loading
	function RecursivelyReconstructFromFile(info : SerializationInfo, ctxt : StreamingContext, id : int)
	{
		nodeID = id;

		var newPosition : Vector3 = Vector3(info.GetValue("positionX_"+id,typeof(float)),
											info.GetValue("positionY_"+id,typeof(float)),
											info.GetValue("positionZ_"+id,typeof(float)));
		var newRotation : Quaternion = Quaternion(  info.GetValue("rotationX_"+id,typeof(float)),
													info.GetValue("rotationY_"+id,typeof(float)),
													info.GetValue("rotationZ_"+id,typeof(float)),
													info.GetValue("rotationW_"+id,typeof(float)));
		SetData(info.GetValue("pieceType_" + id, typeof(int)),
				newPosition,
				newRotation,
				info.GetValue("activator_"+id,typeof(int)),
				info.GetValue("activatorKey_"+id,typeof(char)));
		
		var childCount : int = info.GetValue("childCount_"+id,typeof(int));
		Debug.Log("reconstructing node : "+id+" , child count : "+childCount);
		Debug.Log("Node position : "+newPosition);
		
		for(var i = 0 ; i < childCount ; i++) {
			//var newChildNode = new PieceTreeNode(0);
			AddChild(new PieceTreeNode(0));
			var newChildNode : PieceTreeNode = children[i];
			
			newChildNode.RecursivelyReconstructFromFile(info,ctxt,info.GetValue("children_"+id+"_"+i,typeof(int)));
		//	AddChild(newChildNode);
		}
	}
	
	// called when saving
	function RecursivelySaveIntoFile(info : SerializationInfo, ctxt : StreamingContext) {
		var id = nodeID;
		
		Debug.Log("Recursively Saving into file : "+id+", child count : "+children.length);
		Debug.Log("Pos :  " + position);
	
		info.AddValue("pieceType_"+id, pieceType);
		info.AddValue("positionX_"+id, position.x);
		info.AddValue("positionY_"+id, position.y);
		info.AddValue("positionZ_"+id, position.z);
		info.AddValue("rotationW_"+id, rotation.w);
		info.AddValue("rotationX_"+id, rotation.x);
		info.AddValue("rotationY_"+id, rotation.y);
		info.AddValue("rotationZ_"+id, rotation.z);
		info.AddValue("activator_"+id, activator);
		info.AddValue("activatorKey_"+id, activatorKey);
		info.AddValue("childCount_"+id, children.length);
		
		for(var i = 0 ; i < children.length ; i++){
			var child : PieceTreeNode = children[i];
			info.AddValue("children_"+id+"_"+i,child.nodeID);
			child.RecursivelySaveIntoFile(info, ctxt);
		}
	}
	
	function GetObjectData(info : SerializationInfo, ctxt : StreamingContext){
/*		var id = nodeID;
		
		Debug.Log("Saving node : " + id);
	
		info.AddValue("pieceType_"+id, pieceType);
		info.AddValue("positionX_"+id, position.x);
//		info.AddValue("position_"+id, position);
//		info.AddValue("rotation_"+id, rotation);
		info.AddValue("activator_"+id, activator);
		info.AddValue("activatorKey_"+id, activatorKey);
		info.AddValue("childCount_"+id, children.length);
		
		for(var i = 0 ; i < children.length ; i++){
			info.AddValue("children_"+id+"_"+i,children[i]);
			var child : PieceTreeNode = children[i];
		} */
	}
	
	// Constructs this machine from load and children. Returns the game object that was created - this way, we can set
	// machine pieces attachments of the parent upon return.
	function ConstructSelfAndChildren(parent : GameObject, offset : Vector3) : GameObject {
		//var pieceType = AssetDatabase.LoadAssetAtPath(PieceDictionary.GetPieceTypeFromIndex(pieceType)+".prefab",GameObject);
		var pieceDataType : GameObject = PieceDictionary.GetPieceTypeFromIndex(pieceType);
		var activatorType : String = PieceDictionary.GetPieceTypeFromIndex(activator);
		var newObj : GameObject;
		
		Debug.Log("Constructing " + pieceDataType);
		
		if(parent == null) {
			// if we're on a network and the server, instantiate through the network
			if(Network.isServer) {
				Debug.LogError("Piece type : "+pieceType + " and data type: " + pieceDataType + " with position " + position+offset);
				newObj = Network.Instantiate(pieceDataType,position+offset, rotation, 0);
			}
			else if (!Network.isClient) // if we're not the client and not the server, we're offline
				newObj = GameObject.Instantiate(pieceDataType,position+offset, rotation);
		}
		else {
			if(Network.isServer) {
				Debug.LogError("Piece type : "+pieceType + " and data type: " + pieceDataType + " with position " + position+offset);
				newObj = Network.Instantiate(pieceDataType,position+offset,rotation,0);
				newObj.networkView.RPC("ConnectNetwork",RPCMode.All,parent.networkView.viewID,position+offset,rotation);
			}
			else if (!Network.isClient) { // if we're not the client and not the server, we're offline
				newObj = GameObject.Instantiate(pieceDataType,position+offset,rotation);
				var connector : Connector = newObj.GetComponent("Connector");
				connector.Connect(parent,position+offset,rotation);
			}
		} // else we have a parent, so construct and connect
		
		if(activatorType != null) { // if there's some activator
			Debug.Log("Making activator: " +activatorKey);
			var act : KeyBindedActivator = newObj.AddComponent(activatorType);
			act.key = ""+activatorKey;
			act.attachedPiece = newObj.GetComponent("Connector");
		}
		else
			Debug.Log("No activator found");
		
		var machPieces : MachinePieceAttachments = newObj.GetComponent("MachinePieceAttachments");
		machPieces.clearAttachments();
		//machPieces.connectedObjects[0] = parent;
		
		Debug.Log("Number of children for this node : "+children.length);
		
		// construct children and set machine piece attachments
		for(var i = 0 ; i < children.length ; i++) {
			var child : PieceTreeNode = children[i];
			
			machPieces.connectedObjects[i] = child.ConstructSelfAndChildren(newObj,offset);
		}
		if(parent != null)
			machPieces.connectedObjects[i] = parent;
		
		// return newly constructed object for parental connectedobjects
		return newObj;
	}
	
	function ToString() {
		return "(PieceTreeNode id : "+nodeID+")";
	}
}