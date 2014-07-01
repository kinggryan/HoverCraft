#pragma strict

// Piece Dictionary Class. Implemented as an Array. Stores values used for saving machine designs.

class PieceDictionary{
	static var pieceIndexTable = new Hashtable();
	
	static var initialized = false;
	
	// default constructor. Will be used as a static class.
	function PieceDictionary (){} 
	
	// initialize values for all pieces in the hashtable.
	static function InitializeDictionary(){
		if(!initialized) {
/*			pieceIndexTable.Add(0,AssetDatabase.LoadAssetAtPath("Assets/RobotPieces/ChasisA.prefab",GameObject));
			pieceIndexTable.Add(1,AssetDatabase.LoadAssetAtPath("Assets/RobotPieces/HoverPlate.prefab",GameObject));
			pieceIndexTable.Add(2,AssetDatabase.LoadAssetAtPath("Assets/RobotPieces/MachineGun.prefab",GameObject));
			pieceIndexTable.Add(3,AssetDatabase.LoadAssetAtPath("Assets/RobotPieces/RocketLauncher.prefab",GameObject));
			pieceIndexTable.Add(4,AssetDatabase.LoadAssetAtPath("Assets/RobotPieces/Sawblade.prefab",GameObject));
			pieceIndexTable.Add(5,AssetDatabase.LoadAssetAtPath("Assets/RobotPieces/Thruster.prefab",GameObject));
			pieceIndexTable.Add(6,AssetDatabase.LoadAssetAtPath("Assets/RobotPieces/MultiRocketLauncher.prefab",GameObject));
			pieceIndexTable.Add(7,AssetDatabase.LoadAssetAtPath("Assets/RobotPieces/Puncher.prefab",GameObject));
			pieceIndexTable.Add(8,AssetDatabase.LoadAssetAtPath("Assets/RobotPieces/BombCannon.prefab",GameObject)); */
			pieceIndexTable.Add(0,Resources.Load("ChasisA",GameObject));
			pieceIndexTable.Add(1,Resources.Load("HoverPlate",GameObject));
			pieceIndexTable.Add(2,Resources.Load("MachineGun",GameObject));
			pieceIndexTable.Add(3,Resources.Load("RocketLauncher",GameObject));
			pieceIndexTable.Add(4,Resources.Load("Sawblade",GameObject));
			pieceIndexTable.Add(5,Resources.Load("Thruster",GameObject));
			pieceIndexTable.Add(6,Resources.Load("MultiRocketLauncher",GameObject));
			pieceIndexTable.Add(7,Resources.Load("Puncher",GameObject));
			pieceIndexTable.Add(8,Resources.Load("BombCannon",GameObject));
			pieceIndexTable.Add(100,"KeyBindedActivator");
			pieceIndexTable.Add(101,"KeyBindedActivatorNetworked");
			
			initialized = true;
			
			/*for(var currEntry : DictionaryEntry in pieceIndexTable)
				Debug.Log("Index : "+currEntry.Key + "; value: "+currEntry.Value); */
		}
		else
			Debug.Log("Table Already Initialized");
	}
	
	// Given a piece type, find the index
	static function GetIndexFromPieceType(pieceType) {
		if(pieceType == null)
			return -1;
	
		if(initialized) {
			for(var entry : DictionaryEntry in pieceIndexTable)
				if(entry.Value == pieceType) {
			//		Debug.Log("For value : " + entry.Value + " found key : " + entry.Key);
					return entry.Key;
				}
			
			// if nothing was found, return sentinel value
			Debug.Log("Search failed for value : " + pieceType);
			return -1;
		}
		
		// if uninitialized
		Debug.Log("Attempting To Search Uninitialized");
		return -1;
	}
	
	// Given a piece index, find the piece Type
	static function GetPieceTypeFromIndex(index : int) {
		if(index == -1) {
			return null;
		}
	
		if(!initialized)
			InitializeDictionary();
		
		if(initialized) {
		/*	for(var currEntry : DictionaryEntry in pieceIndexTable)
				Debug.LogError("Index : "+currEntry.Key + "; value: "+currEntry.Value); */
			return pieceIndexTable[index];
		}
		else {
			Debug.LogError("Attempting to Search Uninitialized");
			return null;
		}
	}
}