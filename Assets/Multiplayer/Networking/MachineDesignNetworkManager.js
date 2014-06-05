#pragma strict

// Machine Design Network Manager class. Must be attached to an object with a network view so we can send the RPC via network views

public var playerMachineDesigns : Hashtable;

function SendMachineDesignToServer(filePath : String) {
	// TODO make machine design folder at location relative to application directory - we may already do this
/*	var fileData : String = String.Copy(SaveLoad.MachineDesignToString("MachineDesigns/"+filePath));
	Debug.Log("Send data as string : "+fileData.Length);
	networkView.RPC("LoadMachineDesignOnServer",RPCMode.Server,fileData); */
	var fileData = SaveLoad.MachineDesignToBytes("MachineDesigns/"+filePath);
	networkView.RPC("LoadMachineDesignOnServer",RPCMode.Server,fileData);
}

function PrintRemote() {
	var text : String = "Moby-Dick; or, The Whale (1851) is the sixth book by American writer Herman Melville. The work is an epic sea story of Captain Ahab's voyage in pursuit of a certain sperm whale that he calls Moby Dick (with no hyphen; but some editions of the book change either the title or the whale's name to make them consistent). A contemporary commercial failure and out of print at the time";
	networkView.RPC("PrintText",RPCMode.Server,text);
}

@RPC
function LoadMachineDesignOnServer(data : byte[]) {
	Debug.Log("Data length as string: " + data.Length);
//	var rootNode = SaveLoad.LoadMachineDesignFromString(data);
	//playerMachineDesigns.Add(info.sender,rootNode);
	var rootNode = SaveLoad.LoadMachineDesignFromBytes(data);
}

@RPC
function PrintText(text : String) {
	Debug.Log(text);
	Debug.Log("Text length : " + text.Length);
}