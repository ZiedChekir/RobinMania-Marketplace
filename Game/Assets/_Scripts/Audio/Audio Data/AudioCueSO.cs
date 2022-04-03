using System;
using UnityEngine;

/// <summary>
/// A collection of audio clips that are played in parallel, and support randomisation.
/// </summary>
[CreateAssetMenu(fileName = "newAudioCue", menuName = "Audio/Audio Cue")]
public class AudioCueSO : ScriptableObject
{
	public SequenceMode sequenceMode = SequenceMode.RandomNoImmediateRepeat;
	public bool looping = false;
	[SerializeField] private AudioClip[] audioClips = default;

	public int maxNumberOfInstancesPlayingAtTheSameTime;
	private int _nextClipToPlay;
	private int _lastClipPlayed;

	public AudioClip GetNextClip()
	{
		// Fast out if there is only one clip to play
		if (audioClips.Length == 1)
			return audioClips[0];

		if (_nextClipToPlay == -1)
		{
			// Index needs to be initialised: 0 if Sequential, random if otherwise
			_nextClipToPlay = (sequenceMode == SequenceMode.Sequential) ? 0 : UnityEngine.Random.Range(0, audioClips.Length);
		}
		else
		{
			// Select next clip index based on the appropriate SequenceMode
			switch (sequenceMode)
			{
				case SequenceMode.Random:
					_nextClipToPlay = UnityEngine.Random.Range(0, audioClips.Length);
					break;

				case SequenceMode.RandomNoImmediateRepeat:
					do
					{
						_nextClipToPlay = UnityEngine.Random.Range(0, audioClips.Length);
					} while (_nextClipToPlay == _lastClipPlayed);
					break;

				case SequenceMode.Sequential:
					_nextClipToPlay = (int)Mathf.Repeat(++_nextClipToPlay, audioClips.Length);
					break;
			}
		}

		_lastClipPlayed = _nextClipToPlay;

		return audioClips[_nextClipToPlay];
	}
}



public enum SequenceMode
{
	Random,
	RandomNoImmediateRepeat,
	Sequential,
}