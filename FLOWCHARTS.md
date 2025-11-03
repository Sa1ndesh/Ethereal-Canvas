# 🎨 Ethereal Canvas - Flowcharts & System Diagrams

This document contains comprehensive flowcharts visualizing the architecture, user flows, and processes of the Ethereal Canvas platform.

---

## 📊 Table of Contents
1. [Overall User Journey](#overall-user-journey)
2. [AI Image Generation Flow](#ai-image-generation-flow)
3. [NFT Minting Process Flow](#nft-minting-process-flow)
4. [System Architecture Flow](#system-architecture-flow)
5. [Application Navigation Flow](#application-navigation-flow)
6. [Wallet Connection Flow](#wallet-connection-flow)
7. [Error Handling & Failover Flow](#error-handling--failover-flow)

---

## 🚀 Overall User Journey

```mermaid
flowchart TD
    A[User Lands on App] --> B{First Time User?}
    B -->|Yes| C[View Tutorial/Onboarding]
    B -->|No| D[Login to Account]
    
    C --> D
    D --> E[Select Page: Generate or Gallery]
    
    E -->|Generate| F[Generate Page]
    E -->|Gallery| G[Gallery Page]
    
    F --> H[Enter Prompt]
    H --> I[Enhance Prompt?]
    I -->|Yes| J[AI Prompt Enhancement]
    I -->|No| K[Generate Image]
    J --> K
    
    K --> L{Generation Successful?}
    L -->|Yes| M[Display Generated Image]
    L -->|No| N[Show Error & Retry Options]
    N --> K
    
    M --> O{Mint as NFT?}
    O -->|Yes| P[Connect Wallet]
    O -->|No| Q[Save to Gallery]
    
    P --> R{Wallet Connected?}
    R -->|Yes| S[Mint NFT Process]
    R -->|No| T[Show Wallet Connection Modal]
    T --> R
    
    S --> U{Transaction Successful?}
    U -->|Yes| V[Update Image Status to NFT]
    U -->|No| W[Show Error Message]
    W --> X{Retry?}
    X -->|Yes| S
    X -->|No| Q
    
    V --> Q
    Q --> Y[View in Gallery]
    
    G --> Z[Browse Gallery]
    Z --> AA{Select Image?}
    AA -->|Yes| BB[View Image Details]
    AA -->|No| Z
    
    BB --> CC{Actions}
    CC -->|Download| DD[Export Image]
    CC -->|Share| EE[Share on Social Media]
    CC -->|Mint| P
    CC -->|Delete| FF[Remove from Gallery]
    
    style A fill:#667eea
    style K fill:#764ba2
    style M fill:#4ecdc4
    style S fill:#ff6b6b
    style V fill:#7bed9f
```

---

## 🤖 AI Image Generation Flow

```mermaid
flowchart TD
    A[User Submits Prompt] --> B[Validate Prompt]
    B --> C{Prompt Valid?}
    C -->|No| D[Show Validation Error]
    D --> A
    C -->|Yes| E[Enhance Prompt with AI]
    
    E --> F[Create Enhanced Prompt]
    F --> G[Start Loading State]
    G --> H[Try Service 1: Pollinations AI Enhanced]
    
    H --> I{Success?}
    I -->|Yes| J[Return Image URL]
    I -->|No| K[Try Service 2: Pollinations AI Simple]
    
    K --> L{Success?}
    L -->|Yes| J
    L -->|No| M[Try Service 3: Pollinations Alt Endpoint]
    
    M --> N{Success?}
    N -->|Yes| J
    N -->|No| O[Try Service 4: Placeholder Fallback]
    
    O --> P{Success?}
    P -->|Yes| J
    P -->|No| Q[Try Service 5: Picsum Fallback]
    
    Q --> R{Success?}
    R -->|Yes| J
    R -->|No| S[All Services Failed]
    
    S --> T[Show Error Message]
    T --> U{User Retry?}
    U -->|Yes| H
    U -->|No| V[End Process]
    
    J --> W[Validate Image Loads]
    W --> X{Image Valid?}
    X -->|Yes| Y[Save to Storage]
    X -->|No| H
    
    Y --> Z[Display Generated Image]
    Z --> AA[Save Prompt to History]
    AA --> BB[End: Show Success State]
    
    style A fill:#667eea
    style E fill:#764ba2
    style J fill:#4ecdc4
    style S fill:#ff6b6b
    style Z fill:#7bed9f
```

---

## ⛓️ NFT Minting Process Flow

```mermaid
flowchart TD
    A[User Clicks Mint as NFT] --> B{Wallet Connected?}
    B -->|No| C[Trigger Wallet Connection Flow]
    B -->|Yes| D[Get Network Information]
    
    C --> E{Connection Successful?}
    E -->|Yes| D
    E -->|No| F[Show Error: Please Connect Wallet]
    F --> G[End]
    
    D --> H{Network Supported?}
    H -->|No| I[Show Error: Switch Network]
    I --> J{User Switch?}
    J -->|Yes| D
    J -->|No| G
    
    H -->|Yes| K[Get Smart Contract Address]
    K --> L{Contract Deployed?}
    L -->|No| M[Show Error: Contract Not Available]
    L -->|Yes| N[Prepare NFT Metadata]
    
    M --> G
    
    N --> O[Create Metadata JSON]
    O --> P[Format Prompt as Attribute]
    P --> Q[Set Image URL]
    Q --> R[Add Creation Timestamp]
    R --> S[Encode Metadata]
    
    S --> T[Get Minting Fee]
    T --> U{Sufficient Balance?}
    U -->|No| V[Show Error: Insufficient Funds]
    U -->|Yes| W[Estimate Gas Cost]
    
    V --> G
    
    W --> X[Show Transaction Confirmation]
    X --> Y{User Confirms?}
    Y -->|No| G
    Y -->|Yes| Z[Submit Transaction]
    
    Z --> AA[Wait for Transaction Hash]
    AA --> AB{Transaction Submitted?}
    AB -->|No| AC[Show Error: Transaction Failed]
    AB -->|Yes| AD[Wait for Block Confirmation]
    
    AC --> G
    
    AD --> AE{Transaction Confirmed?}
    AE -->|No| AF[Check Status Polling]
    AF --> AD
    AE -->|Yes| AG[Get Token ID]
    
    AG --> AH[Update Image Status]
    AH --> AI[Save NFT Info to Storage]
    AI --> AJ[Display Success Message]
    AJ --> AK[Show Transaction Link]
    AK --> AL[End: NFT Minted Successfully]
    
    style A fill:#667eea
    style B fill:#764ba2
    style Z fill:#4ecdc4
    style AE fill:#ff6b6b
    style AL fill:#7bed9f
```

---

## 🏗️ System Architecture Flow

```mermaid
flowchart TB
    subgraph "Frontend Layer"
        A[React 19 Application]
        B[TypeScript Components]
        C[Framer Motion Animations]
        D[Tailwind CSS Styling]
    end
    
    subgraph "State Management"
        E[React Hooks]
        F[Local Storage]
        G[IndexedDB]
        H[Gallery State]
    end
    
    subgraph "API Layer"
        I[Netlify Functions]
        J[Image Generation API]
        K[Prompt Enhancement]
    end
    
    subgraph "AI Services"
        L[Pollinations AI]
        M[OpenAI DALL-E]
        N[Stability AI]
        O[Hugging Face]
        P[Replicate]
    end
    
    subgraph "Web3 Layer"
        Q[ethers.js]
        R[WalletConnect]
        S[MetaMask Integration]
        T[Smart Contracts]
    end
    
    subgraph "Blockchain"
        U[Ethereum Mainnet]
        V[Ethereum Sepolia]
        W[Polygon]
    end
    
    subgraph "Storage"
        X[IPFS via Pinata]
        Y[Firebase]
        Z[Browser Storage]
    end
    
    A --> B
    B --> C
    C --> D
    
    A --> E
    E --> F
    F --> G
    G --> H
    
    A --> I
    I --> J
    J --> K
    
    J --> L
    J --> M
    J --> N
    J --> O
    J --> P
    
    A --> Q
    Q --> R
    R --> S
    S --> T
    
    T --> U
    T --> V
    T --> W
    
    T --> X
    H --> Y
    H --> Z
    
    style A fill:#667eea
    style I fill:#764ba2
    style J fill:#4ecdc4
    style T fill:#ff6b6b
    style X fill:#7bed9f
```

---

## 📱 Application Navigation Flow

```mermaid
flowchart TD
    A[App Initialization] --> B[Load User Preferences]
    B --> C[Check Wallet Connection]
    C --> D[Load Gallery from Storage]
    D --> E[Main Layout Rendered]
    
    E --> F[Navigation Menu]
    
    F --> G[Generate Page]
    F --> H[Gallery Page]
    F --> I[Tutorial Mode]
    
    G --> J[Generator Form Component]
    G --> K[Image Display Component]
    
    J --> L[Prompt Input]
    J --> M[Advanced Prompt Builder]
    J --> N[Prompt History]
    J --> O[Prompt Templates]
    
    L --> P[Submit Generation Request]
    M --> P
    N --> L
    O --> L
    
    P --> Q[Show Loading State]
    Q --> K
    
    H --> R[Gallery Grid Component]
    H --> S[Image Details Modal]
    H --> T[Filter & Search]
    
    R --> U[Select Image]
    U --> S
    
    S --> V{Action Selected}
    V -->|Download| W[Export Image]
    V -->|Share| X[Share Dialog]
    V -->|Mint NFT| Y[NFT Minting Flow]
    V -->|Delete| Z[Remove from Gallery]
    V -->|View Details| AA[Show Full Metadata]
    
    T --> AB[Filter by Style]
    T --> AC[Filter by Date]
    T --> AD[Filter by NFT Status]
    T --> AE[Search by Prompt]
    
    I --> AF[Tutorial App Component]
    AF --> AG[Step-by-Step Guide]
    
    style A fill:#667eea
    style G fill:#764ba2
    style H fill:#4ecdc4
    style S fill:#ff6b6b
    style Y fill:#7bed9f
```

---

## 💼 Wallet Connection Flow

```mermaid
flowchart TD
    A[User Clicks Connect Wallet] --> B[Check Browser Support]
    B --> C{Browser Has Web3?}
    
    C -->|Yes| D[Detect Wallet Type]
    C -->|No| E[Show Error: Install Wallet]
    E --> F[Provide Installation Links]
    F --> G[End]
    
    D --> H{Wallet Type}
    H -->|MetaMask| I[Use window.ethereum]
    H -->|WalletConnect| J[Initialize WalletConnect]
    H -->|Other| K[Use WalletConnect]
    
    I --> L[Request Account Access]
    J --> M[Show QR Code]
    K --> M
    
    L --> N{User Approves?}
    M --> O{User Scans/Connects?}
    
    N -->|No| P[Show Error: Connection Rejected]
    N -->|Yes| Q[Get Account Address]
    
    O -->|No| P
    O -->|Yes| Q
    
    P --> G
    
    Q --> R[Get Network Information]
    R --> S{Network Supported?}
    
    S -->|No| T[Show Switch Network Prompt]
    S -->|Yes| U[Get Account Balance]
    
    T --> V{User Switches?}
    V -->|Yes| R
    V -->|No| W[Show Warning: Unsupported Network]
    W --> G
    
    U --> X[Save Wallet State]
    X --> Y[Update UI: Connected]
    Y --> Z[Show Wallet Address]
    Z --> AA[Show Network Info]
    AA --> AB[Show Balance]
    AB --> AC[End: Wallet Connected]
    
    AC --> AD{User Disconnects?}
    AD -->|Yes| AE[Clear Wallet State]
    AE --> AF[Update UI: Disconnected]
    AF --> G
    
    style A fill:#667eea
    style D fill:#764ba2
    style Q fill:#4ecdc4
    style S fill:#ff6b6b
    style AC fill:#7bed9f
```

---

## 🔄 Error Handling & Failover Flow

```mermaid
flowchart TD
    A[Process Started] --> B[Execute Primary Action]
    B --> C{Success?}
    
    C -->|Yes| D[Return Success Result]
    C -->|No| E[Log Error Details]
    
    E --> F{Error Type?}
    
    F -->|Network Error| G[Retry with Exponential Backoff]
    F -->|API Error| H[Switch to Fallback Service]
    F -->|Validation Error| I[Show User-Friendly Message]
    F -->|Blockchain Error| J[Check Network & Retry]
    
    G --> K{Retry Successful?}
    K -->|Yes| D
    K -->|No| L{Max Retries?}
    
    L -->|No| G
    L -->|Yes| M[Use Fallback Strategy]
    
    H --> N[Select Next AI Provider]
    N --> O[Try Fallback Service]
    O --> P{Success?}
    
    P -->|Yes| D
    P -->|No| Q{More Fallbacks?}
    
    Q -->|Yes| N
    Q -->|No| R[All Services Failed]
    
    I --> S[Display Validation Error]
    S --> T[Highlight Error Field]
    T --> U[Suggest Correction]
    U --> V[Wait for User Action]
    
    J --> W{Network Issue?}
    W -->|Yes| X[Show Network Error]
    W -->|No| Y[Check Transaction Status]
    
    X --> Z[Suggest Network Switch]
    Z --> AA{User Switches?}
    AA -->|Yes| B
    AA -->|No| AB[End: User Cancelled]
    
    Y --> AC{Transaction Failed?}
    AC -->|Yes| AD[Show Transaction Error]
    AC -->|No| AE[Check Receipt]
    
    AD --> AF[Suggest Retry with Higher Gas]
    AF --> AG{User Retries?}
    AG -->|Yes| B
    AG -->|No| AB
    
    M --> AH[Use Placeholder/Demo Mode]
    AH --> AI[Notify User of Degraded Mode]
    AI --> AJ[Continue with Limited Functionality]
    
    R --> AK[Show Comprehensive Error]
    AK --> AL[Offer Support Options]
    AL --> AM[End: Process Failed]
    
    style A fill:#667eea
    style D fill:#7bed9f
    style E fill:#ff6b6b
    style H fill:#764ba2
    style R fill:#ff6b6b
    style AM fill:#ff6b6b
```

---

## 📊 Data Flow Diagram

```mermaid
flowchart LR
    subgraph "User Input"
        A[Prompt Text]
        B[Style Selection]
        C[Generation Parameters]
    end
    
    subgraph "Processing"
        D[Prompt Enhancement]
        E[AI Service Selection]
        F[Image Generation]
    end
    
    subgraph "Storage"
        G[Generated Image]
        H[Metadata]
        I[User History]
    end
    
    subgraph "Web3"
        J[IPFS Upload]
        K[Metadata Creation]
        L[Smart Contract Call]
    end
    
    subgraph "Output"
        M[Display Image]
        N[Save to Gallery]
        O[NFT on Blockchain]
    end
    
    A --> D
    B --> D
    C --> D
    
    D --> E
    E --> F
    
    F --> G
    F --> H
    
    G --> M
    H --> I
    
    M --> N
    
    G --> J
    H --> K
    
    J --> L
    K --> L
    
    L --> O
    
    style A fill:#667eea
    style F fill:#764ba2
    style G fill:#4ecdc4
    style L fill:#ff6b6b
    style O fill:#7bed9f
```

---

## 🔐 Authentication & Permission Flow

```mermaid
flowchart TD
    A[User Action Requires Auth] --> B{Wallet Connected?}
    
    B -->|Yes| C{Permission Granted?}
    B -->|No| D[Request Wallet Connection]
    
    C -->|Yes| E[Proceed with Action]
    C -->|No| F[Request Specific Permission]
    
    D --> G{User Connects?}
    G -->|Yes| H[Save Connection State]
    G -->|No| I[Cancel Action]
    
    H --> J[Request Network Access]
    J --> K{Correct Network?}
    
    K -->|Yes| L[Get Account Permissions]
    K -->|No| M[Request Network Switch]
    
    M --> N{User Switches?}
    N -->|Yes| J
    N -->|No| I
    
    L --> O{Permissions Granted?}
    O -->|Yes| E
    O -->|No| P[Show Permission Details]
    
    P --> Q{User Grants?}
    Q -->|Yes| E
    Q -->|No| I
    
    F --> R{Action Type}
    R -->|Read| S[Automatic Permission]
    R -->|Write| T[Require Signature]
    R -->|Transaction| U[Require Transaction Approval]
    
    S --> E
    T --> V[Request Message Signature]
    U --> W[Show Transaction Details]
    
    V --> X{User Signs?}
    W --> Y{User Approves?}
    
    X -->|Yes| E
    X -->|No| I
    
    Y -->|Yes| E
    Y -->|No| I
    
    E --> Z[Execute Action]
    Z --> AA[Update UI State]
    AA --> AB[End: Action Complete]
    
    style A fill:#667eea
    style B fill:#764ba2
    style E fill:#4ecdc4
    style I fill:#ff6b6b
    style AB fill:#7bed9f
```

---

## 🎨 Prompt Enhancement Flow

```mermaid
flowchart TD
    A[User Input Prompt] --> B[Validate Prompt Length]
    B --> C{Prompt Valid?}
    
    C -->|No| D[Show Validation Error]
    D --> E[Suggest Minimum Length]
    E --> A
    
    C -->|Yes| F[Analyze Prompt Content]
    F --> G[Detect Style Keywords]
    G --> H[Detect Quality Keywords]
    H --> I[Detect Subject Keywords]
    
    I --> J[Generate Enhancements]
    J --> K{User Selected Enhancement?}
    
    K -->|Auto-Enhance| L[Apply AI Enhancement]
    K -->|Manual| M[Show Enhancement Options]
    K -->|None| N[Use Original Prompt]
    
    L --> O[Add Style Descriptors]
    O --> P[Add Quality Boosters]
    P --> Q[Add Composition Tips]
    Q --> R[Final Enhanced Prompt]
    
    M --> S[User Selects Options]
    S --> T[Apply Selected Enhancements]
    T --> R
    
    N --> R
    
    R --> U[Show Enhanced Prompt]
    U --> V{User Approves?}
    
    V -->|Yes| W[Use Enhanced Prompt]
    V -->|No| X[User Edits Prompt]
    X --> B
    
    W --> Y[Save to Prompt History]
    Y --> Z[Submit for Generation]
    
    style A fill:#667eea
    style F fill:#764ba2
    style R fill:#4ecdc4
    style W fill:#7bed9f
```

---

## 📈 Gallery Management Flow

```mermaid
flowchart TD
    A[Gallery Page Loaded] --> B[Load Images from Storage]
    B --> C[Check for New NFTs]
    C --> D[Update NFT Statuses]
    D --> E[Display Gallery Grid]
    
    E --> F{User Action}
    
    F -->|Filter| G[Apply Filters]
    F -->|Search| H[Perform Search]
    F -->|Select Image| I[Show Image Details]
    F -->|Scroll| J[Load More Images]
    
    G --> K[Filter by Criteria]
    K --> L{Filter Type}
    L -->|Style| M[Filter by Art Style]
    L -->|Date| N[Filter by Date Range]
    L -->|NFT Status| O[Filter by Minted/Unminted]
    L -->|Favorites| P[Show Only Favorites]
    
    M --> Q[Update Gallery Display]
    N --> Q
    O --> Q
    P --> Q
    
    H --> R[Search in Prompts]
    R --> S[Search in Metadata]
    S --> T[Highlight Matches]
    T --> Q
    
    I --> U[Display Full Image]
    U --> V[Show Metadata]
    V --> W[Show NFT Info if Minted]
    W --> X{User Action on Image}
    
    X -->|Download| Y[Export Image File]
    X -->|Share| Z[Open Share Dialog]
    X -->|Mint| AA[Start NFT Minting]
    X -->|Delete| AB[Confirm Deletion]
    X -->|Favorite| AC[Toggle Favorite]
    X -->|Edit Prompt| AD[Edit & Regenerate]
    
    Y --> AE[Choose Format]
    AE --> AF[Download Image]
    
    Z --> AG[Select Platform]
    AG --> AH[Share Image]
    
    AA --> AI[NFT Minting Process]
    
    AB --> AJ{Confirm?}
    AJ -->|Yes| AK[Remove from Storage]
    AJ -->|No| U
    AK --> Q
    
    AC --> AL[Toggle in Favorites List]
    AL --> Q
    
    AD --> AM[Edit Prompt]
    AM --> AN[Regenerate Image]
    
    J --> AO[Load Next Batch]
    AO --> Q
    
    Q --> E
    
    style A fill:#667eea
    style E fill:#764ba2
    style I fill:#4ecdc4
    style AA fill:#ff6b6b
    style Q fill:#7bed9f
```

---

## 🛠️ How to Use These Flowcharts

### For Markdown Viewers (GitHub, VS Code with Mermaid extension)
These flowcharts use Mermaid syntax and will render automatically in:
- GitHub (when viewing .md files)
- VS Code (with Mermaid extension)
- Most modern markdown viewers

### For Presentations
1. **Copy the Mermaid code** for the flowchart you need
2. **Use online tools:**
   - [Mermaid Live Editor](https://mermaid.live/)
   - Export as PNG/SVG
3. **Embed in PowerPoint/Keynote:**
   - Export as image
   - Insert into slides

### For Documentation
- Use these flowcharts in technical documentation
- Reference specific flows in code comments
- Include in API documentation

---

## 📝 Notes

- **Colors**: Each flowchart uses a consistent color scheme:
  - Blue (#667eea): Starting points
  - Purple (#764ba2): Processing steps
  - Cyan (#4ecdc4): Success states
  - Red (#ff6b6b): Error conditions
  - Green (#7bed9f): Final success/completion

- **Decision Points**: All diamond shapes represent decision points requiring user input or system checks

- **Sub-processes**: Some flows reference other flowcharts (e.g., NFT Minting Flow references Wallet Connection)

---

**Last Updated**: 2025


