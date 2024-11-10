---
title: Markdown Øvelse
description: This post is an example of how to add a new article. Description 50-160 words
publishDate: 11.10.2024
tags:
  - mal
  - obsidian
draft: true
---
Update from phone. 

[Av Nicole](https://notes.nicolevanderhoeven.com/obsidian-playbook/Using+Obsidian/02+Making+Notes+in+Obsidian/Markdown#obsidian-playbook%2FUsing+Obsidian%2F02+Making+Notes+in+Obsidian%2FMarkdown+Markdown)

[Obsidian Help](https://help.obsidian.md/Editing+and+formatting/Basic+formatting+syntax)

### Supported Markdown extensions

| Syntax          | Description                                                                                                               |
| --------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `[[Link]]`      | [Internal links](https://help.obsidian.md/Linking+notes+and+files/Internal+links)                                         |
| `![[Link]]`     | [Embed files](https://help.obsidian.md/Linking+notes+and+files/Embed+files)                                               |
| `![[Link#^id]]` | [Block references](https://help.obsidian.md/Linking+notes+and+files/Internal+links#Link%20to%20a%20block%20in%20a%20note) |
| `^id`           | [Defining a block](https://help.obsidian.md/Linking+notes+and+files/Internal+links#Link%20to%20a%20block%20in%20a%20note) |
| `%%Text%%`      | [Comments](https://help.obsidian.md/Editing+and+formatting/Basic+formatting+syntax#Comments)                              |
| `~~Text~~`      | [Strikethroughs](https://help.obsidian.md/Editing+and+formatting/Basic+formatting+syntax#Styling%20text)                  |
| `==Text==`      | [Highlights](https://help.obsidian.md/Editing+and+formatting/Basic+formatting+syntax#Styling%20text)                      |
| ` ``` `         | [Code blocks](https://help.obsidian.md/Editing+and+formatting/Basic+formatting+syntax#Code%20blocks)                      |
| `- [ ]`         | [Incomplete task](https://help.obsidian.md/Editing+and+formatting/Basic+formatting+syntax#Task%20lists)                   |
| `- [x]`         | [Completed task](https://help.obsidian.md/Editing+and+formatting/Basic+formatting+syntax#Task%20lists)                    |
| `> [!note]`     | [Callouts](https://help.obsidian.md/Editing+and+formatting/Callouts)                                                      |
| (see link)      | [Tables](https://help.obsidian.md/Editing+and+formatting/Advanced+formatting+syntax#Tables)                               |

| First name | Last name |
| ---------- | --------- |
| Max        | Planck    |
| Marie      | Curie     |

### insert image
```md
![Beskrivelse av bildet](xxx.png)
```
![a cactus logo](logo.png)


## Embed an image in a note

To embed an image:

```md
![[Engelbart.jpg]]
```

![Engelbart.jpg > outline](https://publish-01.obsidian.md/access/f786db9fac45774fa4f0d8112e232d67/Attachments/Engelbart.jpg)

You can change the image dimensions, by adding `|640x480` to the link destination, where 640 is the width and 480 is the height.

```md
![[Engelbart.jpg|100x145]]
```

If you only specify the width, the image scales according to its original aspect ratio. For example, `![[Engelbart.jpg|100]]`.

![Engelbart.jpg#outline](https://publish-01.obsidian.md/access/f786db9fac45774fa4f0d8112e232d67/Attachments/Engelbart.jpg)

You can also embed an externally hosted image by using a markdown link. You can control the width and height the same way as a wikilink.

```md
![250](https://publish-01.obsidian.md/access/f786db9fac45774fa4f0d8112e232d67/Attachments/Engelbart.jpg)
```

![250](https://publish-01.obsidian.md/access/f786db9fac45774fa4f0d8112e232d67/Attachments/Engelbart.jpg)

