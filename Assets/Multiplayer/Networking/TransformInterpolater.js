#pragma strict

// Transform Interpolater component. When attaached to an object and observed with the object's network view, smoothly interpolates
// the movement of the object.

class State extends System.ValueType {
	var timestamp : double;
    var pos : Vector3;
    var rot : Quaternion;
}

class TransformInterpolater extends MonoBehaviour
{
	
	//
	// NOTE: Network interpolation is affected by the network sendRate.
	// By default this is 10 times/second for OnSerialize. (See PhotonNetwork.sendIntervalOnSerialize)
	// Raise the sendrate if you want to lower the interpolationBackTime.
	//
	
    public var interpolationBackTime : double = 0.15;

    // We store twenty states with "playback" information
    var m_BufferedState : State[] = new State[20];
    // Keep track of what slots are used
    var m_TimestampCount : int;

    function Awake()
    {
        if (networkView.isMine)
            this.enabled = false;//Only enable inter/extrapol for remote players
    }

    function OnSerializeNetworkView(stream : BitStream, info : NetworkMessageInfo)
    {
    	var pos : Vector3;
    	var rot : Quaternion;
    	
        // Always send transform (depending on reliability of the network view)
        if (stream.isWriting)
        {
            pos = transform.localPosition;
            rot = transform.localRotation;
            stream.Serialize(pos);
            stream.Serialize(rot);
        }
        // When receiving, buffer the information
        else
        {
			// Receive latest state information
            pos = Vector3.zero;
            rot = Quaternion.identity;
            stream.Serialize(pos);
            stream.Serialize(rot);

            // Shift buffer contents, oldest data erased, 18 becomes 19, ... , 0 becomes 1
            for (var i = m_BufferedState.Length - 1; i >= 1; i--)
            {
                m_BufferedState[i] = m_BufferedState[i - 1];
            }
			
			
            // Save currect received state as 0 in the buffer, safe to overwrite after shifting
            var state : State;
            state.timestamp = info.timestamp;
            state.pos = pos;
            state.rot = rot;
            m_BufferedState[0] = state;

            // Increment state count but never exceed buffer size
            m_TimestampCount = Mathf.Min(m_TimestampCount + 1, m_BufferedState.Length);

            // Check integrity, lowest numbered state in the buffer is newest and so on
            for (i = 0; i < m_TimestampCount - 1; i++)
            {
                if (m_BufferedState[i].timestamp < m_BufferedState[i + 1].timestamp)
                    Debug.Log("State inconsistent");
            }
		}
    }

    // This only runs where the component is enabled, which is only on remote peers (server/clients)
    function Update()
    {
        var currentTime : double = Network.time;
        var interpolationTime : double = currentTime - interpolationBackTime;
        // We have a window of interpolationBackTime where we basically play 
        // By having interpolationBackTime the average ping, you will usually use interpolation.
        // And only if no more data arrives we will use extrapolation

        // Use interpolation
        // Check if latest state exceeds interpolation time, if this is the case then
        // it is too old and extrapolation should be used
        if (m_BufferedState[0].timestamp > interpolationTime)
        {
			 for (var i = 0; i < m_TimestampCount; i++)
            {
                // Find the state which matches the interpolation time (time+0.1) or use last state
                if (m_BufferedState[i].timestamp <= interpolationTime || i == m_TimestampCount - 1)
                {
                    // The state one slot newer (<100ms) than the best playback state
                    var rhs : State = m_BufferedState[Mathf.Max(i - 1, 0)];
                    // The best playback state (closest to 100 ms old (default time))
                    var lhs : State = m_BufferedState[i];

                    // Use the time between the two slots to determine if interpolation is necessary
                    var length : double = rhs.timestamp - lhs.timestamp;
                    var t : float = 0.0F;
                    // As the time difference gets closer to 100 ms t gets closer to 1 in 
                    // which case rhs is only used
                    if (length > 0.0001)
                        t = ((interpolationTime - lhs.timestamp) / length);

                    // if t=0 => lhs is used directly
                    transform.localPosition = Vector3.Lerp(lhs.pos, rhs.pos, t);
                    transform.localRotation = Quaternion.Slerp(lhs.rot, rhs.rot, t);
					return;
                }
            }
        }
        // Use extrapolation. Here we do something really simple and just repeat the last
        // received state. You can do clever stuff with predicting what should happen.
        else
        {
            var latest : State = m_BufferedState[0];

            transform.localPosition = Vector3.Lerp(transform.localPosition, latest.pos, Time.deltaTime * 20 );
            transform.localRotation = latest.rot;
        }
    }
}