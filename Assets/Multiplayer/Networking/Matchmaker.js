class Matchmaker extends Photon.MonoBehaviour
{
    private var myPhotonView : PhotonView;

    // Use this for initialization
    function Start()
    {
        PhotonNetwork.ConnectUsingSettings("0.1");
    }

    function OnJoinedLobby()
    {
        Debug.Log("JoinRandom");
        PhotonNetwork.JoinRandomRoom();
    }

    function OnPhotonRandomJoinFailed()
    {
        PhotonNetwork.CreateRoom(null);
    }
}
