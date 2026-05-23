# typed: false
# frozen_string_literal: true

# MapleSpike CLI — Canadian government data pipeline
# Homebrew formula: brew install maplespike/tap/maplespike

class Maplespike < Formula
  desc "Canadian government data pipeline — one unified API for Parliament, lobbying, immigration, courts, and more"
  homepage "https://maplespike.ca"
  url "https://github.com/reverb256/maplespike/archive/refs/tags/v0.2.0.tar.gz"
  sha256 "0000000000000000000000000000000000000000000000000000000000000000"
  license "AGPL-3.0-or-later"

  depends_on "node" => ">=18"
  depends_on "pnpm" => :build

  def install
    system "pnpm", "install", "--frozen-lockfile"
    system "pnpm", "-r", "build"

    libexec.install Dir["*"]

    bin.install_symlink libexec/"packages/pipeline-core/dist/cli/ingest.js" => "maplespike"
  end

  test do
    output = shell_output("#{bin}/maplespike --help 2>&1", 1)
    assert_match "MAPLESPIKE_PIPELINE", output
  end
end
