#pragma strict

import System.Text;
import System.IO;
import System.Runtime.Serialization.Formatters.Binary;
 
import System;
import System.Runtime.Serialization;
import System.Reflection;

// Generic SaveData Class
class SaveData extends System.Object {
	public var testData : int = 15;
	
	function SaveData() {}
	
	function SaveData (info : SerializationInfo, ctxt : StreamingContext){
		testData = info.GetValue("testData", typeof(int));
	}
	
	function GetObjectData(info : SerializationInfo, ctxt : StreamingContext){
		Debug.Log("testSaveData saving");
		info.AddValue("testData", testData);
	}
}

// Machine Design Save Data class
class MachineDesignSaveData extends System.Object implements ISerializable{
	public var rootNode : PieceTreeNode;
	public var rootNodeID : int;
	
	function MachineDesignSaveData() {}
	
	function MachineDesignSaveData(RN : PieceTreeNode)
	{
	//	rootNode = RN;
	}
	
	// loads save data into a tree
	function MachineDesignSaveData (info : SerializationInfo, ctxt : StreamingContext) {
		var rootNodeID = info.GetValue("rootNodeID", typeof(int));
		rootNode = new PieceTreeNode(rootNodeID);
		Debug.Log("Loading with root node : "+rootNode);
		rootNode.RecursivelyReconstructFromFile(info,ctxt,rootNodeID);
	}
	
	// save root data
	function GetObjectData(info : SerializationInfo, ctxt : StreamingContext) {
		info.AddValue("rootNodeID", rootNode.nodeID);
		rootNode.RecursivelySaveIntoFile(info,ctxt);
	}
	
}

class SaveLoad {

	public static var currentFilePath = "SaveData.cjc";
	
	static function Save()
	{
		Save(currentFilePath);
	}

	static function Save(filePath : String)
	{
		var data = new SaveData();
		data.testData = -10;
		
		var stream = File.Open(filePath, FileMode.Create);
		var bformatter = new BinaryFormatter();
		bformatter.Binder = new VersionDeserializationBinder();
		bformatter.Serialize(stream,data);
		stream.Close();
	}
	
	static function Load ()
	{
		Load(currentFilePath);
	}
	
	static function Load(filePath : String)
	{
		var data = new SaveData();
		var stream = File.Open(filePath, FileMode.Open);
		var bformatter = new BinaryFormatter();
		bformatter.Binder = new VersionDeserializationBinder();
		data = bformatter.Deserialize(stream);
		stream.Close();
		
		Debug.Log("Loaded Data : " + data.testData);
	}
	
	static function SaveMachineDesign(rootNode : PieceTreeNode)
	{
		SaveMachineDesign(currentFilePath, rootNode);
	}
	
	static function SaveMachineDesign(filePath : String, rootNode : PieceTreeNode)
	{
		var data : MachineDesignSaveData = new MachineDesignSaveData();
		data.rootNode = rootNode;
		
		var stream = File.Open(filePath, FileMode.Create);
		var bformatter = new BinaryFormatter();
		bformatter.Binder = new VersionDeserializationBinder();
		bformatter.Serialize(stream,data);
		stream.Close();
		
		Debug.Log("Save Complete");
	}
	
	static function LoadMachineDesign()
	{
		return LoadMachineDesign(currentFilePath);
	}
	
	static function LoadMachineDesign(filePath : String) {
		var data = new MachineDesignSaveData();
		var stream = File.Open(filePath, FileMode.Open);
		var bformatter = new BinaryFormatter();
		bformatter.Binder = new VersionDeserializationBinder();
		data = bformatter.Deserialize(stream);
		stream.Close();
		
		Debug.Log("Machine Design Loaded with root node " + data.rootNode +" and first child : " + data.rootNode.children[0]);
		
		return data;
	}
	
	// Takes a machine design at the given filepath and turns the file into a string. Used for sending across networks.
	static function MachineDesignToString(filePath : String) : String {
		var stream = File.Open(filePath, FileMode.Open);
		var array : byte[] = new byte[stream.Length];
		stream.Read(array,0,stream.Length);
		
		Debug.Log("Stream Length :  "+ stream.Length);
		
	/*	var chars : char[] = new char[array.Length];
    	System.Buffer.BlockCopy(array, 0, chars, 0, array.Length);
    	var string = new String(chars); */
    	var string : String = System.Text.Encoding.Unicode.GetString(array);
		
		//var string = new String(array);
		return string;
	}
	
	// takes a machine design file and returns the data of that file
	static function MachineDesignToBytes(filePath : String) : byte[] {
		var stream = File.Open(filePath, FileMode.Open);
		var array : byte[] = new byte[stream.Length];
		stream.Read(array,0,stream.Length);
		return array;
	}
	
	// TODO this
	static function LoadMachineDesignFromString(remoteData : String) {
		var localData = new MachineDesignSaveData();
	
	/*	var bytes : byte[] = new byte[remoteData.Length];
		Debug.Log(remoteData.Length);
		System.Buffer.BlockCopy(remoteData.ToCharArray(), 0, bytes, 0, remoteData.Length); */
		
		// remote Data is sent as a unicode array
		var encoder = new UnicodeEncoding();
		var bytes = encoder.GetBytes(remoteData.ToCharArray());
		
		var stream = new MemoryStream(bytes);
		
		Debug.Log("Stream Length " +stream.Length);
		
		var bformatter = new BinaryFormatter();
		bformatter.Binder = new VersionDeserializationBinder();
		localData = bformatter.Deserialize(stream);
		stream.Close();
		
//		Debug.Log("Machine Design Loaded with root node " + data.rootNode +" and first child : " + data.rootNode.children[0]);
		
		return localData;
	}
	
	// Takes raw byte data of a machine design and constructs a tree
	static function LoadMachineDesignFromBytes(remoteData : byte[]) {
		var localData = new MachineDesignSaveData();
		
		var stream = new MemoryStream(remoteData);
		
		var bformatter = new BinaryFormatter();
		bformatter.Binder = new VersionDeserializationBinder();
		localData = bformatter.Deserialize(stream);
		stream.Close();
		
		return localData;
	}
}

class VersionDeserializationBinder extends SerializationBinder
{
	override function BindToType( assemblyName : String, typeName : String)
	{
		if(!String.IsNullOrEmpty(assemblyName) && !String.IsNullOrEmpty(typeName))
		{
			var typeToDeserialize : Type = null;
		
			assemblyName = Assembly.GetExecutingAssembly().FullName;
		
			typeToDeserialize = Type.GetType(String.Format( "{0}, {1}", typeName, assemblyName));
		
			return typeToDeserialize;
		}
		
		return null;
	}
}