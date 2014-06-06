Exec {
  path => ['/usr/sbin', '/usr/bin', '/sbin', '/bin', '/usr/local/bin', '/usr/local/node/node-default/bin']
}

stage { 'preinstall':
  before => Stage['main']
}
stage { 'postinstall': }
stage { 'startapp': }

Stage['main'] ->
Stage['postinstall'] ->
Stage['startapp']

# Define the install_packages class
class install_packages {
  package { ['curl', 'build-essential', 'libfontconfig1', 'python',
             'g++', 'make', 'wget', 'tar', 'mc', 'htop']:
    ensure => present
  }
}

# Declare (invoke) install_packages
class { 'install_packages':
  stage => preinstall,
}

class { 'nodejs':
  version => 'v0.10.28',
}

package { 'gulp':
  provider => npm,
  require => Class['nodejs'],
}

class {'::mongodb::server':
  port    => 27017,
  verbose => true,
}

class npmInstalls {
    exec { "npmInstalls":
        cwd => "/vagrant/shell",
        command => "/bin/bash npm-installs.sh",
    }
}

class { 'npmInstalls':
    stage => postinstall,
}

class startGulp {
    exec { "gulp":
        cwd => "/vagrant/shell",
        command => "/bin/bash run-gulp.sh",
    }
}

class { 'startGulp':
    stage => startapp,
}
