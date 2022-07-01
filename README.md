# VU-VRM
A lip-sync VRM avatar client for zero-webcam mic-based vtubing: 
[automattic.github.io/VU-VRM/](https://automattic.github.io/VU-VRM/)

![Image](/assets/VU-VRM.gif?raw=true "VU-VRM")

# Why?
Because multitasking. Because sometimes you need to run an avatar without a webcam. Because vtubers are disabled too. Because everyone gets webcam fatigue. Because it's not always essential to bring your face to work. Because an avatar the folks associate with you can be more personable than a little green light when you're on a voice call. Because I made this for use at work, and it's turned out real handy. Because what if [VRM](https://vrm.dev/en/), but with PNGtuber rules?


# Usage
While this works just fine for testing if you [visit its pages url](https://automattic.github.io/VU-VRM/) (and allow mic access), it's intended for use in [OBS](https://obsproject.com) as a browser source.

Use the interface (or drag and drop) to load a local .vrm file, set your levels, dismiss the UI and you're good to lipsync in a kinda-lifelike way for steams or virtual webcam for other chat apps.

Plays nice with VRMs created in [VroidStudio](https://vroid.com/en/studio) and other standard compliant VRMs. 

# Interface
Minimal; intended to acheive a mic volume threshold at which the avatar's mouth and body moves, adjust gain as needed, then to be dismissed.

This volume = movement aspect is what makes this avatar client literally a form of VU volume unit meter, hence its name.

# OBS launch specifics
To allow browser sources in OBS (like this) to receive mic input, OBS needs launching with these arguments:

`--use-fake-ui-for-media-stream --allow-file-access-from-files`

- MacOS Terminal: `/Applications/OBS.app/Contents/MacOS/obs  --use-fake-ui-for-media-stream --allow-file-access-from-files`
- Windows: create a shortcut to OBS and add the arguments to the *Target* field in the shortcut's properties.
- Linux users don't need hints to launch things with arguments ;)

VU-VRM can then be added as an OBS browser source [from a URL](https://automattic.github.io/VU-VRM/) or as a [local file](https://github.com/Automattic/VU-VRM/archive/refs/heads/trunk.zip), and is intentionally transparent for the purpose.

# ToDo
- Mic input selector
- Background controls
- localstorage use
- Smoother more natural state-to-state eased body movement
- Use expression blendshapes to ease between low percentage thereof for more facial motion
- Use all available vowel blendshapes
- Separate frequency reponse array into vowelsounds and sibliants to cue appropriate shapes
- a less basic default pose
- Migrate from ScriptProcessorNode method to AudioWorkletNode
- Hook it to chat app APIs for group VRM chats!

# Changelog
- Veritcal slider based interface
- Input level VU
- Two-expression crossfade with random wander and bias slider
