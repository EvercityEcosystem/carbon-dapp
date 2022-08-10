# Evercity Carbon dApp

## Introduction

Carbon dApp is an application for creating, issuing, transfering and burning carbon assets in substrate-based networks. This app provides convenient user interface for calling functions of `carbon-assets` pallet.

You can find more details in repository of `carbon-assets` pallet which this dApp works with: https://github.com/EvercityEcosystem/carbon-assets#overview

## Quick Start

1.Install dependencies using **yarn**:

```
yarn
```

3. Write environment variables in `.env.*` file:

```
VITE_WS_PROVIDER_URL=<<Your endpoint to substrate network>>
VITE_NETWORK_CODE=<<Code of substrate network for encoding/decoding ss58 format>>
VITE_EXTENSION_NAME=polkadot-js
VITE_PINATA_JWT=<<Your key in pinata.cloud>>
```

4. Start the development server:
```
yarn dev
```

Build and start in production mode:
```
yarn build && yarn start
```