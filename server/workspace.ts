import { Router } from "express";

const router = Router();

// Google Calendar: Fetch events
router.get("/calendar/events", async (req, res) => {
  const token = req.headers.authorization; // Expects "Bearer <accessToken>"
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Missing Google Access Token" });
  }
  try {
    const response = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events?maxResults=15&orderBy=startTime&singleEvents=true", {
      headers: { Authorization: token }
    });
    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({ error: errText });
    }
    const data = await response.json();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Google Calendar: Create event
router.post("/calendar/events", async (req, res) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Missing Google Access Token" });
  }
  try {
    const event = req.body;
    const response = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(event)
    });
    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({ error: errText });
    }
    const data = await response.json();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Gmail: Fetch messages
router.get("/gmail/messages", async (req, res) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Missing Google Access Token" });
  }
  try {
    const response = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=10", {
      headers: { Authorization: token }
    });
    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({ error: errText });
    }
    const listData = await response.json();
    const messages = [];
    if (listData.messages && listData.messages.length > 0) {
      for (const msg of listData.messages) {
        const msgRes = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}`, {
          headers: { Authorization: token }
        });
        if (msgRes.ok) {
          const fullMsg = await msgRes.json();
          messages.push(fullMsg);
        }
      }
    }
    res.json({ messages });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Gmail: Send message
router.post("/gmail/send", async (req, res) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Missing Google Access Token" });
  }
  try {
    const { to, subject, body } = req.body;
    if (!to || !subject || !body) {
      return res.status(400).json({ error: "Missing required fields (to, subject, body)" });
    }

    // Gmail API expects RFC 2822 formatted message encoded in base64url
    const messageParts = [
      `To: ${to}`,
      'Content-Type: text/html; charset=utf-8',
      'MIME-Version: 1.0',
      `Subject: ${subject}`,
      '',
      body
    ];
    const message = messageParts.join('\n');
    
    const base64Safe = Buffer.from(message)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    const response = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ raw: base64Safe })
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({ error: errText });
    }
    const data = await response.json();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Google Drive: Find/Create 'Reports' folder and upload PDF report
router.post("/drive/upload-report", async (req, res) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Missing Google Access Token" });
  }

  try {
    const { fileName, pdfBase64 } = req.body;
    if (!fileName || !pdfBase64) {
      return res.status(400).json({ error: "Missing required fields (fileName, pdfBase64)" });
    }

    // 1. Search for folder named 'Reports'
    const searchUrl = "https://www.googleapis.com/drive/v3/files?q=" + 
      encodeURIComponent("name = 'Reports' and mimeType = 'application/vnd.google-apps.folder' and trashed = false") +
      "&fields=files(id,name)";

    const searchRes = await fetch(searchUrl, {
      headers: { Authorization: token }
    });

    if (!searchRes.ok) {
      const errText = await searchRes.text();
      return res.status(searchRes.status).json({ error: `Failed to search folder: ${errText}` });
    }

    const searchData = (await searchRes.json()) as { files?: { id: string; name: string }[] };
    let folderId = "";

    if (searchData.files && searchData.files.length > 0) {
      folderId = searchData.files[0].id;
    } else {
      // 2. Create 'Reports' folder
      const createFolderRes = await fetch("https://www.googleapis.com/drive/v3/files", {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: "Reports",
          mimeType: "application/vnd.google-apps.folder"
        })
      });

      if (!createFolderRes.ok) {
        const errText = await createFolderRes.text();
        return res.status(createFolderRes.status).json({ error: `Failed to create folder: ${errText}` });
      }

      const folderData = (await createFolderRes.json()) as { id: string };
      folderId = folderData.id;
    }

    // 3. Multipart Upload of the PDF file
    const boundary = "-------314159265358979323846";
    const delimiter = `\r\n--${boundary}\r\n`;
    const close_delim = `\r\n--${boundary}--`;

    const metadata = {
      name: fileName,
      mimeType: "application/pdf",
      parents: [folderId]
    };

    const multipartBody = Buffer.concat([
      Buffer.from(delimiter + "Content-Type: application/json; charset=UTF-8\r\n\r\n" + JSON.stringify(metadata) + delimiter + "Content-Type: application/pdf\r\n\r\n"),
      Buffer.from(pdfBase64, "base64"),
      Buffer.from(close_delim)
    ]);

    const uploadRes = await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart", {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": `multipart/related; boundary=${boundary}`,
        "Content-Length": String(multipartBody.length)
      },
      body: multipartBody
    });

    if (!uploadRes.ok) {
      const errText = await uploadRes.text();
      return res.status(uploadRes.status).json({ error: `Failed to upload file: ${errText}` });
    }

    const uploadData = await uploadRes.json();
    res.json({ success: true, file: uploadData });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
