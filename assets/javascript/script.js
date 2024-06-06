
document.querySelector("#content-load").innerHTML = `
<div class="card-column-1">
  <div class="card radius-all box-shadow">
    <div class="card-text radius-tlr">
      <h3 class="font-color">MCBE Manifest Generator</h3>
    </div>
    <div class="card-text font-color">
      <table><tbody>
        <tr><td>Name</td><td>:  <input type="text" class="input-text font-color" placeholder="Name" id="name"></td></tr>
        <tr><td>Description</td><td>:  <input type="text" class="input-text font-color" placeholder="Description" id="description"></td></tr>
        <tr><td>Version</td><td>:  <input type="text" class="input-version font-color" placeholder="1" pattern="[0-9]*" maxlength="3" id="version1"> <input type="text" class="input-version font-color" placeholder="0" pattern="[0-9]*" maxlength="3" id="version2"> <input type="text" class="input-version font-color" placeholder="0" pattern="[0-9]*" maxlength="3" id="version3"></td></tr>
        <tr><td>Min engine version</td><td>:  <input type="text" class="input-version font-color" placeholder="1" pattern="[0-9]*" maxlength="3" id="mcVersion1"> <input type="text" class="input-version font-color" placeholder="13" pattern="[0-9]*" maxlength="3" id="mcVersion2"> <input type="text" class="input-version font-color" placeholder="0" pattern="[0-9]*" maxlength="3" id="mcVersion3"></td></tr>
        <tr><td>Pack type</td><td>:  <select class="input-text font-color" id="select_type_pack"><option value="1">Resources</option><option value="2">Behavior</option><option value="3">World template</option><option value="4">Skin pack</option></select></td></tr>
        <tr><td>Capability</td><td>:  <select class="input-text font-color" id="select_capability"><option value="1">Normal</option><option value="2">PBR</option><option value="3">RayTraced</option></select></td></tr>
      </tbody></table>
    </div><br>
    <div class="card-text font-color">
      <div class="button-dropdown">
        <p>Meta Data</p>
        <input type="checkbox" id="button_metadata">
        <span>\u25b6</span>
      </div>
    </div>
    <div class="card-text card-dropdown font-color" id="card_metadata_content">
      <table><tbody>
        <tr><td>Author this project</td><td>:  <input type="text" class="input-text font-color" placeholder="@XioneQatsu" id="mdAuthor"></td></tr>
        <tr><td>License this project</td><td>:  <input type="text" class="input-text font-color" placeholder="MIT License" id="mdLicense"></td></tr>
        <tr><td>Source this project</td><td>:  <input type="text" class="input-text font-color" placeholder="https://xioneqatsu.github.io" id="mdUrl"></td></tr>
      </tbody></table>
    </div><br>
    <div class="card-text font-color">
      <div class="button-dropdown">
        <p>Dependencies</p>
        <input type="checkbox" id="button_dependencies">
        <span>\u25b6</span>
      </div>
    </div>
    <div class="card-text card-dropdown font-color" id="card_dependencies_content">
      <table><tbody>
        <tr><td>Other pack UUID</td><td>:  <input type="text" class="input-text font-color" placeholder="########-####-4###-####-############" id="opUUID" maxlength="36"></td></tr>
        <tr><td>Other pack version</td><td>:  <input type="text" class="input-version font-color" placeholder="1" pattern="[0-9]*" maxlength="3" id="opVersion1"> <input type="text" class="input-version font-color" placeholder="0" pattern="[0-9]*" maxlength="3" id="opVersion2"> <input type="text" class="input-version font-color" placeholder="0" pattern="[0-9]*" maxlength="3" id="opVersion3"></td></tr>
      </tbody></table>
    </div>
    <br><button class="card-btn font-color" id="generate">Generate</button>
  </div>
</div>
<div class="card-column-1">
  <div class="card radius-all box-shadow">
    <div class="card-text radius-tlr">
      <h4 class="font-color">Result</h4>
    </div>
    <div class="card-result radius-all font-color">
      <code class="font-acme" id="result"></code>
    </div>
    <br><button class="card-btn font-color" id="download">Download file</button>
  </div>
</div>
`;

let buttonMetaData = document.getElementById('button_metadata');
  buttonMetaData.onclick = () => { document.getElementById('card_metadata_content').classList.toggle('card-dropdown-flex'); };

let buttonDependencies = document.getElementById('button_dependencies');
  buttonDependencies.onclick = () => { document.getElementById('card_dependencies_content').classList.toggle('card-dropdown-flex'); };

document.getElementById('generate').onclick = () => {
  let mdAuthor = document.getElementById('mdAuthor').value;
  let mdLicense = document.getElementById('mdLicense').value;
  let mdUrl = document.getElementById('mdUrl').value;
  let packName = document.getElementById('name').value;
    packName = packName == '' ? 'Name' : packName;

  let packDescription = document.getElementById('description').value;
    packDescription = packDescription == '' ? 'Description' : packDescription;

  function UUIDv4() {
    let uuid = "", random;
    for (let i = 0; i < 32; i++) {
      random = Math.random() * 16 | 0;
      if (i == 8 || i == 12 || i == 16 || i == 20) uuid += "-";
      uuid += (i == 12 ? 4 : (i == 16 ? (random & 3 | 8) : random)).toString(16);
    }
    return uuid;
  }

  let version1 = document.getElementById('version1').value, version2 = document.getElementById('version2').value, version3 = document.getElementById('version3').value;
  let mcVersion1 = document.getElementById('mcVersion1').value, mcVersion2 = document.getElementById('mcVersion2').value, mcVersion3 = document.getElementById('mcVersion3').value;
  let formatVersion = mcVersion2 == '' ? '13' : mcVersion2;
  formatVersion = formatVersion == '0' ? false
    : formatVersion == '1' ? false
    : formatVersion == '2' ? false
    : formatVersion == '3' ? false
    : formatVersion == '4' ? false
    : formatVersion == '5' ? false
    : formatVersion == '6' ? false
    : formatVersion == '7' ? false
    : formatVersion == '8' ? false
    : formatVersion == '9' ? false
    : formatVersion == '10' ? false
    : formatVersion == '11' ? false
    : formatVersion == '12' ? false
    : true;

  let typePack = document.getElementById('select_type_pack').value;
  typePack = typePack == '1' ? 'resources'
    : typePack == '2' ? 'data'
    : typePack == '3' ? 'world_template'
    : typePack == '4' ? 'skin_pack'
    : typePack;

  let capability = document.getElementById('select_capability').value;
  capability = capability == '1' ? ''
    : capability == '2' ? 'pbr'
    : capability == '3' ? 'raytraced'
    : capability;

  let opUUID = document.getElementById("opUUID").value;
  let opVersion1 = document.getElementById('opVersion1').value, opVersion2 = document.getElementById('opVersion2').value, opVersion3 = document.getElementById('opVersion3').value;

  let manifestJSON = `
{
  "format_version": ${formatVersion ? '2' : '1'},${mdAuthor != '' ? `
  "metadata": {
    "authors": [
      "${mdAuthor}"
    ],
    "license": "${mdLicense}",
    "url": "${mdUrl}"
  },` : ``}
  "header": {
    "name": "${packName}",
    "description": "${packDescription}",
    "uuid": "${UUIDv4()}",
    "version": [
      ${version1 == '' ? '1' : version1},
      ${version2 == '' ? '0' : version2},
      ${version3 == '' ? '0' : version3}
    ],${typePack == 'world_template' ? `
    "lock_template_options": true,` : ``}
    ${typePack == 'world_template' ? `"base_game_version"` : `"min_engine_version"`}: [
      ${mcVersion1 == '' ? '1' : mcVersion1},
      ${mcVersion2 == '' ? '13' : mcVersion2},
      ${mcVersion3 == '' ? '0' : mcVersion3}
    ]
  },${capability == '' ? `` : typePack == 'resources' ? `
  "capabilities": [ "${capability}" ],` : ``}${opUUID != '' ? `
  "dependencies": [
    {
      "uuid": "${opUUID}",
      "version": [
        ${opVersion1 == '' ? '1' : opVersion1},
        ${opVersion2 == '' ? '0' : opVersion2},
        ${opVersion3 == '' ? '0' : opVersion3}
      ]
    }
  ],` : `` }
  "modules": [
    {
      "type": "${typePack}",
      "uuid": "${UUIDv4()}",
      "version": [
        ${version1 == '' ? '1' : version1},
        ${version2 == '' ? '0' : version2},
        ${version3 == '' ? '0' : version3}
      ]
    }
  ]
}
`;

  document.getElementById('result').innerHTML = manifestJSON;
  downloadFile('download', manifestJSON);
}

function downloadFile(id, text) {
  document.getElementById(id).onclick = () => {
    let linkContent = document.createElement('a');
    let textContent = document.createElement('textarea');
      textContent.value = text;
    let fileContent = new Blob([textContent.value], { type: 'text/plain' });
      linkContent.href = URL.createObjectURL(fileContent);
      linkContent.download = 'manifest.json';
      linkContent.click();
    URL.revokeObjectURL(linkContent.href);
  }
}
