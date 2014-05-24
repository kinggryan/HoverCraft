#pragma strict

// Piece Dictionary Class. Implemented as an Array. Stores 
class PieceDictionary{
	static var pieceIndexTable = new Hashtable();
	
	static var initialized = false;
	
	// default constructor. Will be used as a static class.
	function PieceDictionary (){} 
	
	// initialize values for all pieces in the hashtable.
	static function InitializeDictionary(){
		if(!initialized) {
			pieceIndexTable.Add(0,AssetDatabase.LoadAssetAtPath("Assets/RobotPieces/ChasisA.prefab",GameObject));
			pieceIndexTable.Add(1,AssetDatabase.LoadAssetAtPath("Assets/RobotPieces/HoverPlate.prefab",GameObject));
			pieceIndexTable.Add(2,AssetDatabase.LoadAssetAtPath("Assets/RobotPieces/MachineGun.prefab",GameObject));
			pieceIndexTable.Add(3,AssetDatabase.LoadAssetAtPath("Assets/RobotPieces/RocketLauncher.prefab",GameObject));
			pieceIndexTable.Add(4,AssetDatabase.LoadAssetAtPath("Assets/RobotPieces/Sawblade.prefab",GameObject));
			pieceIndexTable.Add(5,AssetDatabase.LoadAssetAtPath("Assets/RobotPieces/Thruster.prefab",GameObject));
			pieceIndexTable.Add(6,AssetDatabase.LoadAssetAtPath("Assets/RobotPieces/MultiRocketLauncher.prefab",GameObject));
			pieceIndexTable.Add(7,AssetDatabase.LoadAssetAtPath("Assets/RobotPieces/Puncher.prefab",GameObject));
			pieceIndexTable.Add(8,AssetDatabase.LoadAssetAtPath("Assets/RobotPieces/BombCannon.prefab",GameObject));
			pieceIndexTable.Add(100,"KeyBindedActivator");
			
			initialized = true;
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
					Debug.Log("For value : " + entry.Value + " found key : " + entry.Key);
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
	
		if(initialized) {
			return pieceIndexTable[index];
		}
		else {
			Debug.Log("Attempting to Search Uninitialized");
			return null;
		}
	}
}