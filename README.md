# VU-VRM
A lip-sync [VRM](https://vrm.dev/en/) avatar client for zero-webcam mic-based vtubing

![Image](/assets/VU-VRM.gif?raw=true "VU-VRM")

[automattic.github.io/VU-VRM/](https://automattic.github.io/VU-VRM/)

# Why?
Because multitasking. Because sometimes you need to run an avatar without a webcam. Because vtubers are disabled too. Because it's not always essential to bring your face to work. Because an avatar the folks associate with you can be more personable than a little green light when you're on a voice call. Because what if VRM, but with PNGtuber rules?

# Usage
While this works just fine for testing if you [visit its pages url](https://automattic.github.io/VU-VRM/) (and allow mic access), it's intended for use in [OBS](https://obsproject.com) as a browser source.

Use the interface (or drag and drop) to load a local .vrm file, set your levels, dismiss the UI and you're good to lipsync in a kinda-lifelike way for steams or virtual webcam for other chat apps.

Plays nice with VRMs created in [VroidStudio](https://vroid.com/en/studio) and other standard compliant VRMs. 

# Interface
Minimal; intended to acheive a mic volume threshold at which the avatar's mouth and body moves, then to be dismissed.

In case your mic / input is quiet, the gain can boost the mouth or body movement.

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
- Slider based interface scaled to vh/vw to ensure operability at high dpi
- Background controls
- localstorage use
- Smoother more natural state-to-state eased body movement
- Use expression blendshapes to ease between low percentage thereof for more facial motion
- Use all available vowel blendshapes
- Separate frequency reponse array into vowelsounds and sibliants to cue appropriate shapes
- a less basic default pose
- Migrate from ScriptProcessorNode method to AudioWorkletNode
- Hook it to chat app APIs for group VRM chats!