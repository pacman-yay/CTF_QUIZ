const API_URL = "https://script.google.com/macros/s/AKfycbzrczVuXQdsZNRmZvQ6M1rxgYszuBU3qBRVAzKvk05PZ9cVmTnfBbg3TLMxIPnt32ew6g/exec";

export async function login(teamName, password) {
  return await fetchApi({ action: 'login', teamName, password });
}

export async function getQuestions(teamId) {
  return await fetchApi({ action: 'getQuestions', teamId });
}

export async function startQuiz(teamId, password) {
  return await fetchApi({ action: 'startQuiz', teamId, password });
}

export async function submitQuiz(payload) {
  // payload: { teamId, teamName, answers, submissionType }
  return await fetchApi({ action: 'submitQuiz', ...payload });
}

async function fetchApi(payload) {
  // If API URL is not configured or user is using the mock team, return mock data
  if (!API_URL || API_URL.includes("YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL")) {
    console.log("Using Mock API for payload:", payload);
    return handleMockApi(payload);
  }

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API Fetch Error:", error);
    return {
      success: false,
      message: "Unable to connect to the quiz server. Please check your connection and try again.",
    };
  }
}

// -------------------------------------------------------------
// MOCK BACKEND FOR LOCAL TESTING
// -------------------------------------------------------------
const mockDelay = (ms) => new Promise(res => setTimeout(res, ms));

async function handleMockApi(payload) {
  await mockDelay(800); // Simulate network latency

  switch (payload.action) {
    case 'login':
      if (payload.teamName === 'mock' && payload.password === 'mock') {
        return {
          success: true,
          team: {
            teamId: 'MOCK_001',
            teamName: 'Mock Team',
            quizStarted: false,
            submitted: false,
            startTime: null
          }
        };
      }
      return { success: false, message: 'For local testing, use Team Name: mock | Password: mock' };

    case 'getQuestions':
      return {
        success: true,
        questions: [
          {
            "questionId": "Q1",
            "question": "What is the standard port used by default for SSH connections?",
            "optionA": "21",
            "optionB": "22",
            "optionC": "23",
            "optionD": "80",
            "category": "CyberSecurity"
          },
          {
            "questionId": "Q2",
            "question": "Which encoding scheme uses a 64-character set (A–Z, a–z, 0–9, +, /) and often ends with '=' padding?",
            "optionA": "Base32",
            "optionB": "Base64",
            "optionC": "Hexadecimal",
            "optionD": "ROT13",
            "category": "CyberSecurity"
          },
          {
            "questionId": "Q3",
            "question": "In Web Exploitation, what does XSS stand for?",
            "optionA": "Cross-Site Scripting",
            "optionB": "Cross-Site Security",
            "optionC": "Cross-Server Scripting",
            "optionD": "Cyber Site Shield",
            "category": "CyberSecurity"
          },
          {
            "questionId": "Q4",
            "question": "Which Linux command is commonly used to inspect human-readable text hidden inside a binary or unknown file?",
            "optionA": "grep",
            "optionB": "strings",
            "optionC": "cat",
            "optionD": "file",
            "category": "CyberSecurity"
          },
          {
            "questionId": "Q5",
            "question": "Decipher the Caesar cipher string 'synt{grfg}' rotated with a key of ROT13:",
            "optionA": "flag{pass}",
            "optionB": "flag{test}",
            "optionC": "ctf_{test}",
            "optionD": "flag{root}",
            "category": "CyberSecurity"
          },
          {
            "questionId": "Q6",
            "question": "Which Wireshark filter syntax displays only HTTP traffic?",
            "optionA": "port == 80",
            "optionB": "protocol.http",
            "optionC": "http",
            "optionD": "tcp.port = 80",
            "category": "CyberSecurity"
          },
          {
            "questionId": "Q7",
            "question": "What is the magic number (first 8 bytes) header of a standard PNG image in hex?",
            "optionA": "FF D8 FF E0",
            "optionB": "89 50 4E 47 0D 0A 1A 0A",
            "optionC": "47 49 46 38",
            "optionD": "50 4B 03 04",
            "category": "CyberSecurity"
          },
          {
            "questionId": "Q8",
            "question": "Which HTTP method is typically used to request data from a specified resource without making modifications?",
            "optionA": "POST",
            "optionB": "PUT",
            "optionC": "GET",
            "optionD": "DELETE",
            "category": "CyberSecurity"
          },
          {
            "questionId": "Q9",
            "question": "What does the SQL payload \"' OR '1'='1\" achieve during an authentication bypass?",
            "optionA": "Deletes the users table",
            "optionB": "Evaluates the query condition to always TRUE",
            "optionC": "Encrypts database responses",
            "optionD": "Triggers an automatic server reboot",
            "category": "CyberSecurity"
          },
          {
            "questionId": "Q10",
            "question": "Which tool is widely used for network scanning, host discovery, and port enumeration?",
            "optionA": "John the Ripper",
            "optionB": "Nmap",
            "optionC": "Ghidra",
            "optionD": "Volatility",
            "category": "CyberSecurity"
          },
          {
            "questionId": "Q11",
            "question": "What is the output length of an MD5 hash in hexadecimal characters?",
            "optionA": "16",
            "optionB": "32",
            "optionC": "64",
            "optionD": "128",
            "category": "CyberSecurity"
          },
          {
            "questionId": "Q12",
            "question": "Which file on a web server tells search engine crawlers which pages or files they can or cannot request?",
            "optionA": ".htaccess",
            "optionB": "robots.txt",
            "optionC": "sitemap.xml",
            "optionD": "web.config",
            "category": "CyberSecurity"
          },
          {
            "questionId": "Q13",
            "question": "What is the default subnet mask for a Class C IPv4 network?",
            "optionA": "255.0.0.0",
            "optionB": "255.255.0.0",
            "optionC": "255.255.255.0",
            "optionD": "255.255.255.255",
            "category": "CyberSecurity"
          },
          {
            "questionId": "Q14",
            "question": "In steganography, what does LSB stand for?",
            "optionA": "Low System Byte",
            "optionB": "Least Significant Bit",
            "optionC": "Large Stego Binary",
            "optionD": "Linear Shift Buffer",
            "category": "CyberSecurity"
          },
          {
            "questionId": "Q15",
            "question": "Which command-line utility in Linux is used to display network routing tables and active network connections?",
            "optionA": "netstat",
            "optionB": "ifconfig",
            "optionC": "ping",
            "optionD": "traceroute",
            "category": "CyberSecurity"
          },
          {
            "questionId": "Q16",
            "question": "Which of the following describes an asymmetric encryption algorithm?",
            "optionA": "AES-256",
            "optionB": "DES",
            "optionC": "RSA",
            "optionD": "ChaCha20",
            "category": "CyberSecurity"
          },
          {
            "questionId": "Q17",
            "question": "What vulnerability occurs when an application accepts user input representing a file path without proper sanitization (e.g., '../../etc/passwd')?",
            "optionA": "Server-Side Request Forgery (SSRF)",
            "optionB": "Local File Inclusion (LFI) / Path Traversal",
            "optionC": "Remote Code Execution (RCE)",
            "optionD": "Cross-Site Request Forgery (CSRF)",
            "category": "CyberSecurity"
          },
          {
            "questionId": "Q18",
            "question": "In x86-64 assembly architecture, which register holds the function return address before returning to the caller?",
            "optionA": "Stored on the Stack (popped by ret into RIP)",
            "optionB": "RAX",
            "optionC": "RSP",
            "optionD": "RBP",
            "category": "CyberSecurity"
          },
          {
            "questionId": "Q19",
            "question": "What memory protection mechanism randomizes the memory addresses of the stack, heap, and libraries on each execution?",
            "optionA": "DEP / NX",
            "optionB": "ASLR",
            "optionC": "Stack Canary",
            "optionD": "PIE",
            "category": "CyberSecurity"
          },
          {
            "questionId": "Q20",
            "question": "Which tool is specifically designed for analyzing volatile memory (RAM dumps) in digital forensics?",
            "optionA": "Autopsy",
            "optionB": "Volatility",
            "optionC": "Wireshark",
            "optionD": "Binwalk",
            "category": "CyberSecurity"
          },
          {
            "questionId": "Q21",
            "question": "In JWT (JSON Web Tokens), which component contains the algorithm and token type metadata?",
            "optionA": "Payload",
            "optionB": "Header",
            "optionC": "Signature",
            "optionD": "Claim",
            "category": "CyberSecurity"
          },
          {
            "questionId": "Q22",
            "question": "What XOR operation property ensures that if A ^ B = C, then which of the following is TRUE?",
            "optionA": "C ^ A = B",
            "optionB": "C ^ B = A",
            "optionC": "A ^ A = 0",
            "optionD": "All of the above",
            "category": "CyberSecurity"
          },
          {
            "questionId": "Q23",
            "question": "What is a 'Stack Canary' used for in compiled binaries?",
            "optionA": "Speeding up function lookups",
            "optionB": "Detecting buffer overflows before malicious return code executes",
            "optionC": "Encrypting function arguments",
            "optionD": "Preventing reverse engineering via decompiler crashes",
            "category": "CyberSecurity"
          },
          {
            "questionId": "Q24",
            "question": "In Burp Suite, which module allows automated, customizable brute-force and fuzzing attacks against web endpoints?",
            "optionA": "Repeater",
            "optionB": "Intruder",
            "optionC": "Sequencer",
            "optionD": "Decoder",
            "category": "CyberSecurity"
          },
          {
            "questionId": "Q25",
            "question": "Which HTTP response header prevents a web page from being rendered inside an <iframe> to stop Clickjacking?",
            "optionA": "X-Frame-Options",
            "optionB": "Strict-Transport-Security",
            "optionC": "Content-Type",
            "optionD": "Access-Control-Allow-Origin",
            "category": "CyberSecurity"
          },
          {
            "questionId": "Q26",
            "question": "What is the primary objective of a Padding Oracle Attack?",
            "optionA": "Decrypting ciphertext without knowing the private/secret key",
            "optionB": "Overwriting the return pointer on the call stack",
            "optionC": "Exploiting race conditions in file uploads",
            "optionD": "Flooding network interfaces with crafted padding bytes",
            "category": "CyberSecurity"
          },
          {
            "questionId": "Q27",
            "question": "Which Linux utility extracts firmware images, file systems, and embedded files from binary blobs?",
            "optionA": "dd",
            "optionB": "binwalk",
            "optionC": "strace",
            "optionD": "ltrace",
            "category": "CyberSecurity"
          },
          {
            "questionId": "Q28",
            "question": "In x86 assembly, what does the instruction 'xor eax, eax' accomplish?",
            "optionA": "Sets eax to -1",
            "optionB": "Clears/sets eax to 0",
            "optionC": "Swaps the high and low bytes of eax",
            "optionD": "Multiplies eax by 2",
            "category": "CyberSecurity"
          },
          {
            "questionId": "Q29",
            "question": "What type of vulnerability allows an attacker to induce the backend web application to make HTTP requests to an arbitrary domain chosen by the attacker?",
            "optionA": "CSRF",
            "optionB": "SSRF",
            "optionC": "CORS Misconfiguration",
            "optionD": "IDOR",
            "category": "CyberSecurity"
          },
          {
            "questionId": "Q30",
            "question": "What is an Insecure Direct Object Reference (IDOR)?",
            "optionA": "An SQL injection in an ORDER BY clause",
            "optionB": "Accessing objects or user accounts by manipulating an identifier parameter without proper authorization checks",
            "optionC": "Directly pointing an IP address to a DNS server",
            "optionD": "A buffer overflow in direct object memory",
            "category": "CyberSecurity"
          },
          {
            "questionId": "Q31",
            "question": "In Return-Oriented Programming (ROP), what instruction must terminate every gadget to chain execution?",
            "optionA": "nop",
            "optionB": "jmp eax",
            "optionC": "ret",
            "optionD": "call",
            "category": "CyberSecurity"
          },
          {
            "questionId": "Q32",
            "question": "When the RSA public exponent is e = 3 and the same unpadded message m is encrypted and sent to 3 different recipients (n1, n2, n3), which attack recovers m?",
            "optionA": "Wiener's Small Private Exponent Attack",
            "optionB": "Håstad's Broadcast Attack using the Chinese Remainder Theorem",
            "optionC": "Common Modulus Attack",
            "optionD": "Factoring via Pollard's p-1",
            "category": "CyberSecurity"
          },
          {
            "questionId": "Q33",
            "question": "In x86-64 Linux calling conventions (System V AMD64 ABI), what order are the first 3 integer/pointer function arguments passed into registers?",
            "optionA": "RDI, RSI, RDX",
            "optionB": "RAX, RBX, RCX",
            "optionC": "RSI, RDI, RBP",
            "optionD": "RDX, RCX, R8",
            "category": "CyberSecurity"
          },
          {
            "questionId": "Q34",
            "question": "What glibc heap exploitation technique involves corrupting the forward pointer (fd) of a freed fastbin chunk to allocate a chunk at an arbitrary address?",
            "optionA": "Fastbin Dup / Fastbin Poisoning",
            "optionB": "Off-by-one NULL byte overwrite",
            "optionC": "House of Force",
            "optionD": "Unsorted Bin Attack",
            "category": "CyberSecurity"
          },
          {
            "questionId": "Q35",
            "question": "What is the core condition that enables Wiener's Attack on an RSA key pair?",
            "optionA": "The modulus N is small (< 512 bits)",
            "optionB": "The private exponent d satisfies d < (1/3) * N^(1/4)",
            "optionC": "The public exponent e is extremely large (e > N)",
            "optionD": "The primes p and q are identical",
            "category": "CyberSecurity"
          },
          {
            "questionId": "Q36",
            "question": "In Web security, which template engine vulnerability allows remote command execution via payloads like '{{self._TemplateReference__context.cycler.__init__.__globals__.os.popen('id').read()}}'?",
            "optionA": "PHP Object Injection",
            "optionB": "Jinja2 (SSTI - Server-Side Template Injection)",
            "optionC": "Smarty Template Injection",
            "optionD": "XPath Injection",
            "category": "CyberSecurity"
          },
          {
            "questionId": "Q37",
            "question": "What vulnerability occurs when deserializing unvalidated user input in Python using the 'pickle' module?",
            "optionA": "Memory leak",
            "optionB": "Arbitrary code execution via the __reduce__ method",
            "optionC": "SQL query corruption",
            "optionD": "Type confusion leading to stack exhaustion",
            "category": "CyberSecurity"
          },
          {
            "questionId": "Q38",
            "question": "In Linux dynamic linking, what mechanism resolves PLT/GOT relocations immediately at startup rather than lazily, neutralizing many GOT overwrite techniques?",
            "optionA": "Partial RELRO",
            "optionB": "Full RELRO (Bind Now)",
            "optionC": "PIE (Position Independent Executable)",
            "optionD": "NX / No-Execute bit",
            "category": "CyberSecurity"
          },
          {
            "questionId": "Q39",
            "question": "In Diffie-Hellman Key Exchange over modular prime groups, which mathematical problem provides the computational hardness of key recovery?",
            "optionA": "Integer Factorization Problem",
            "optionB": "Discrete Logarithm Problem",
            "optionC": "Shortest Vector Problem (SVP)",
            "optionD": "Knapsack Problem",
            "category": "CyberSecurity"
          },
          {
            "questionId": "Q40",
            "question": "What is a 'Format String' vulnerability exploit conversion specifier that writes the count of characters output so far into arbitrary memory?",
            "optionA": "%x",
            "optionB": "%s",
            "optionC": "%n",
            "optionD": "%p",
            "category": "CyberSecurity"
          },
          {
            "questionId": "Q41",
            "question": "What type of web attack abuses discrepancies between front-end reverse proxies and backend servers in parsing Content-Length and Transfer-Encoding headers?",
            "optionA": "HTTP Request Smuggling",
            "optionB": "HTTP Response Splitting",
            "optionC": "Cross-Site WebSocket Hijacking",
            "optionD": "Cache Poisoned Denial of Service",
            "category": "CyberSecurity"
          },
          {
            "questionId": "Q42",
            "question": "In modern Glibc heap implementations (2.26+), which caching mechanism handles small-size heap chunks per-thread without locking before checking fastbins?",
            "optionA": "Unsorted bin",
            "optionB": "Tcache (Thread Local Cache)",
            "optionC": "Small bin",
            "optionD": "Top chunk",
            "category": "CyberSecurity"
          },
          {
            "questionId": "Q43",
            "question": "What is the primary cryptographic weakness of using AES in Electronic Codebook (ECB) mode?",
            "optionA": "Inability to parallelize encryption",
            "optionB": "Identical plaintext blocks produce identical ciphertext blocks, leaking structural patterns",
            "optionC": "High vulnerability to padding oracle attacks",
            "optionD": "Short key space of 64 bits",
            "category": "CyberSecurity"
          },
          {
            "questionId": "Q44",
            "question": "What does the system call 'ptrace(PTRACE_TRACEME, ...)' typically achieve when executed in a binary during reverse engineering?",
            "optionA": "Dynamic stack allocation",
            "optionB": "Anti-debugging protection (preventing debuggers like GDB from attaching)",
            "optionC": "Self-decryption of .text section",
            "optionD": "Bypassing ASLR",
            "category": "CyberSecurity"
          },
          {
            "questionId": "Q45",
            "question": "When analyzing a compromised Windows endpoint, where are executed program records, execution counts, and timestamps stored in the registry for user artifact analysis?",
            "optionA": "SAM Hive",
            "optionB": "UserAssist keys (HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\UserAssist)",
            "optionC": "SYSTEM\\CurrentControlSet\\Services",
            "optionD": "BCD (Boot Configuration Data)",
            "category": "CyberSecurity"
          },
          {
            "questionId": "Q46",
            "question": "In Blind SQL Injection where error messages and response texts are suppressed, which technique extracts data character-by-character based on server response latency?",
            "optionA": "Time-Based Blind using functions like pg_sleep() or SLEEP()",
            "optionB": "Out-of-band ICMP redirect",
            "optionC": "Second-Order Table Dropping",
            "optionD": "Heap spray injection",
            "category": "CyberSecurity"
          },
          {
            "questionId": "Q47",
            "question": "What vulnerability pattern in smart contracts occurs when an external call is made to an untrusted contract before internal state variables are updated?",
            "optionA": "Integer Underflow",
            "optionB": "Reentrancy Attack",
            "optionC": "Front-running / MEV extraction",
            "optionD": "Short Address Attack",
            "category": "CyberSecurity"
          },
          {
            "questionId": "Q48",
            "question": "In elliptic curve cryptography, what attack applies when an implementation accepts arbitrary points without validating that they lie on the defined curve?",
            "optionA": "Invalid Curve Attack / Small Subgroup Attack",
            "optionB": "Side-channel power trace attack",
            "optionC": "Bleichenbacher Attack",
            "optionD": "Dual EC DRBG Backdoor",
            "category": "CyberSecurity"
          },
          {
            "questionId": "Q49",
            "question": "In a ret2libc attack on an x86-64 binary, why is an extra dummy 'ret' gadget frequently inserted before the 'system()' call in the ROP chain?",
            "optionA": "To reset the canary value",
            "optionB": "To satisfy the 16-byte stack alignment requirement for SIMD/SSE instructions in glibc",
            "optionC": "To pass /bin/sh as the second argument",
            "optionD": "To bypass the NX bit",
            "category": "CyberSecurity"
          },
          {
            "questionId": "Q50",
            "question": "What is the significance of the '__attribute__((constructor))' function attribute in GCC/Clang compiled binaries?",
            "optionA": "It marks functions to run automatically before main() executes",
            "optionB": "It enforces read-only access on the heap",
            "optionC": "It destroys debugging symbols at compile time",
            "optionD": "It causes the program to crash upon dynamic inspection",
            "category": "CyberSecurity"
          }
        ]
      };

    case 'startQuiz':
      return {
        success: true,
        startTime: new Date().toISOString()
      };

    case 'submitQuiz':
      return {
        success: true,
        message: 'Mock submission successful.'
      };

    default:
      return { success: false, message: 'Mock Action not recognized' };
  }
}
