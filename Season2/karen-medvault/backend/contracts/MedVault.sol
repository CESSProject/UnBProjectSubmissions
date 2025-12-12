// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ProofOfExistenceDeOSS_Pro {

    struct FileInfo {
        address owner;
        uint256 timestamp;
        string fid;
        bool exists;
    }

    struct Access {
        bool allowed;
        uint256 expiration;
    }

    mapping(bytes32 => FileInfo) public files;
    mapping(address => bytes32[]) public userFiles;
    mapping(bytes32 => mapping(address => Access)) public accessList;

    event FileRegistered(address indexed owner, bytes32 indexed fileHash, string fid);
    event FileRemoved(address indexed owner, bytes32 indexed fileHash);
    event AccessGranted(bytes32 indexed fileHash, address indexed doctor, uint256 expiration);
    event AccessRevoked(bytes32 indexed fileHash, address indexed doctor);
    event FileTransferred(address indexed from, address indexed to, bytes32 indexed fileHash);

    error FileAlreadyExists();
    error NotOwner();
    error InvalidExpiration();
    error NoExistingAccess();
    error FileDoesNotExist();
    error CannotTransferToSelf();

    modifier notExists(bytes32 hash) {
        if (files[hash].exists) revert FileAlreadyExists();
        _;
    }

    modifier fileMustExistAndOnlyOwner(bytes32 hash) {
        if (!files[hash].exists) revert FileDoesNotExist();
        if (files[hash].owner != msg.sender) revert NotOwner();
        _;
    }

    function _removeHashFromUserFiles(address user, bytes32 hash) internal {
        bytes32[] storage list = userFiles[user];
        for (uint256 i = 0; i < list.length; i++) {
            if (list[i] == hash) {
                list[i] = list[list.length - 1];
                list.pop();
                break;
            }
        }
    }

    function registerFile(bytes32 hash, string memory fid)
        public
        notExists(hash)
        returns (bool)
    {
        files[hash] = FileInfo(msg.sender, block.timestamp, fid, true);
        userFiles[msg.sender].push(hash);
        emit FileRegistered(msg.sender, hash, fid);
        return true;
    }

    function removeFile(bytes32 hash)
        public
        fileMustExistAndOnlyOwner(hash)
        returns (bool)
    {
        delete files[hash];
        _removeHashFromUserFiles(msg.sender, hash);
        emit FileRemoved(msg.sender, hash);
        return true;
    }

    function transferFile(bytes32 hash, address newOwner)
        public
        fileMustExistAndOnlyOwner(hash)
        returns (bool)
    {
        require(newOwner != msg.sender, "Cannot transfer to self");
        require(newOwner != address(0), "Invalid new owner");

        address oldOwner = msg.sender;
        files[hash].owner = newOwner;

        _removeHashFromUserFiles(oldOwner, hash);
        userFiles[newOwner].push(hash);

        emit FileTransferred(oldOwner, newOwner, hash);
        return true;
    }

    // 🔴 🔴 🔴 ÚNICA FUNÇÃO REALMENTE ALTERADA 🔴 🔴 🔴
    function grantAccess(bytes32 hash, address doctor, uint256 expiration)
        public
        fileMustExistAndOnlyOwner(hash)
    {
        require(doctor != address(0), "Invalid doctor address");
        require(doctor != msg.sender, "Self access not allowed");
        require(expiration > block.timestamp, "Invalid expiration");

        accessList[hash][doctor] = Access(true, expiration);
        emit AccessGranted(hash, doctor, expiration);
    }

    function revokeAccess(bytes32 hash, address doctor)
        public
        fileMustExistAndOnlyOwner(hash)
    {
        Access memory a = accessList[hash][doctor];
        if (!a.allowed) revert NoExistingAccess();
        delete accessList[hash][doctor];
        emit AccessRevoked(hash, doctor);
    }

    function hasAccess(bytes32 hash, address user)
        public
        view
        returns (bool)
    {
        if (!files[hash].exists) return false;
        if (files[hash].owner == user) return true;
        Access memory a = accessList[hash][user];
        return a.allowed && a.expiration > block.timestamp;
    }

    function hasFile(bytes32 hash) public view returns (bool) {
        return files[hash].exists;
    }

    function getMyFiles() public view returns (bytes32[] memory) {
        return userFiles[msg.sender];
    }

    function getFileInfo(bytes32 hash)
        public
        view
        returns (address owner, uint256 timestamp, string memory fid, bool exists)
    {
        FileInfo memory f = files[hash];
        return (f.owner, f.timestamp, f.fid, f.exists);
    }
}

